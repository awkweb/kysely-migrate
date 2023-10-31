import { capitalCase } from 'change-case'
import { type ColumnMetadata, type TableMetadata } from 'kysely'
import {
  EmitHint,
  type Identifier,
  type ImportSpecifier,
  NewLineKind,
  ScriptTarget,
  SyntaxKind,
  type TypeAliasDeclaration,
  type TypeNode,
  type TypeReferenceNode,
  createPrinter,
  createSourceFile,
  factory,
  isTypeReferenceNode,
} from 'typescript'

import {
  kyselyColumnTypeIdentifier,
  kyselyGeneratedIdentifier,
  kyselyGeneratedImportSpecifier,
  kyselyInsertableIdentifier,
  kyselyInsertableImportSpecifier,
  kyselySelectableIdentifier,
  kyselySelectableImportSpecifier,
  kyselyUpdateableIdentifier,
  kyselyUpdateableImportSpecifier,
  unwrapColumnTypeIdentifier,
  unwrapColumnTypeTypeAlias,
} from './declarations.js'
import { mysqlDefinitions } from './definitions/mysql.js'
import { postgresDefinitions } from './definitions/postgres.js'
import { sqliteDefinitions } from './definitions/sqlite.js'
import { type Definitions, type Dialect } from './types.js'

// Useful links:
// - https://ts-ast-viewer.com
// - https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

const dialectDefinitions = {
  mysql: mysqlDefinitions,
  postgres: postgresDefinitions,
  sqlite: sqliteDefinitions,
} satisfies Record<Dialect, Definitions>

export function getTypes(
  tableMetadata: TableMetadata[],
  enums: Map<string, string[]>,
  dialect: Dialect | undefined,
  customDefinitions: Definitions | undefined = {},
) {
  // Get dialect node mapping
  if (!dialect && !customDefinitions)
    throw new Error(
      '`dialect` and/or `customDefinitions` required for codegen.',
    )
  const definitions = {
    ...(dialect && dialectDefinitions[dialect]),
    ...customDefinitions,
  }

  const nodes = []
  const importsMap: Map<string, Set<ImportSpecifier>> = new Map()
  const typeDeclarationsMap: Map<string, TypeAliasDeclaration> = new Map()

  // Create types
  const dbTypeParameters = []
  for (const table of tableMetadata) {
    // Create type property for each column
    const columnProperties = []
    for (const column of table.columns) {
      const columnProperty = getColumnType(
        column,
        table,
        enums,
        definitions,
        importsMap,
        typeDeclarationsMap,
      )
      columnProperties.push(columnProperty)
    }

    // Create table type alias
    // TODO: Handle schemas and views
    // https://kysely.dev/docs/recipes/schemas
    const tableTypeName = capitalCase(table.name)
    const tableTypeIdentifier = factory.createIdentifier(tableTypeName)
    const tableTypeAlias = factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      tableTypeIdentifier,
      undefined,
      factory.createTypeLiteralNode(columnProperties),
    )
    nodes.push(tableTypeAlias)

    // Create `Selectable`, `Insertable` and `Updateable` wrappers for table type
    if (importsMap.has('kysely')) {
      const kyselyImports = importsMap.get('kysely')!
      kyselyImports.add(kyselySelectableImportSpecifier)
      kyselyImports.add(kyselyInsertableImportSpecifier)
      kyselyImports.add(kyselyUpdateableImportSpecifier)
      importsMap.set('kysely', kyselyImports)
    } else
      importsMap.set(
        'kysely',
        new Set([
          kyselySelectableImportSpecifier,
          kyselyInsertableImportSpecifier,
          kyselyUpdateableImportSpecifier,
        ]),
      )

    const insertableTypeAlias = createWrapperTypeAlias(
      tableTypeName,
      tableTypeIdentifier,
      'insertable',
    )
    const selectableTypeAlias = createWrapperTypeAlias(
      tableTypeName,
      tableTypeIdentifier,
      'selectable',
    )
    const updateableTypeAlias = createWrapperTypeAlias(
      tableTypeName,
      tableTypeIdentifier,
      'updateable',
    )
    nodes.push(selectableTypeAlias, insertableTypeAlias, updateableTypeAlias)

    // Create table type property for encompassing `DB` type
    const tableDbTypeParameter = factory.createPropertySignature(
      undefined,
      table.name,
      undefined,
      factory.createTypeReferenceNode(tableTypeIdentifier, undefined),
    )
    dbTypeParameters.push(tableDbTypeParameter)
  }

  // Add in type declarations
  nodes.unshift(...typeDeclarationsMap.values())

  // Add imports statement to start of nodes
  for (const [name, imports] of importsMap.entries()) {
    const importDeclaration = factory.createImportDeclaration(
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([...imports.values()]),
      ),
      factory.createStringLiteral(name),
      undefined,
    )
    nodes.unshift(importDeclaration)
  }

  // Create `DB` type alias
  const dbNode = factory.createInterfaceDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier('DB'),
    undefined,
    undefined,
    dbTypeParameters,
  )
  nodes.push(dbNode)

  // Print and combine all nodes
  let content = '/** generated by kysely-migrate */\n'
  const printer = createPrinter({ newLine: NewLineKind.LineFeed })
  for (const node of nodes) {
    content += printer.printNode(
      EmitHint.Unspecified,
      node,
      createSourceFile('', '', ScriptTarget.Latest),
    )
    content += '\n\n'
  }

  return content
}

export function getColumnType(
  column: ColumnMetadata,
  table: TableMetadata,
  enums: Map<string, string[]>,
  definitions: Definitions,
  importsMap: Map<string, Set<ImportSpecifier>>,
  typeDeclarationsMap: Map<string, TypeAliasDeclaration>,
) {
  let dataType: keyof typeof definitions = column.dataType
  // postgres enums have `dataType` set to enum object
  if (enums.has(`${table.schema}.${column.dataType}`)) dataType = 'enum'

  // Get type from lookup
  let type: TypeNode
  if (dataType in definitions) {
    const definition = definitions[dataType] as Definitions[string]
    if ('value' in definition) {
      type = definition.value
      for (const [name, imports] of Object.entries(definition.imports)) {
        if (importsMap.has(name)) {
          const nameImports = importsMap.get(name)!
          importsMap.set(name, new Set([...nameImports, ...imports]))
        } else importsMap.set(name, new Set(imports))
      }
      for (const declaration of definition.declarations) {
        typeDeclarationsMap.set(declaration.name.escapedText!, declaration)
      }
    } else if (typeof definition === 'function') {
      type = definition(column, table, enums)
    } else type = definition
  } else type = factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)

  // Create node based on properties (e.g. nullable, default)
  let columnTypeNode: TypeNode
  if (column.isNullable)
    columnTypeNode = factory.createUnionTypeNode([
      type,
      factory.createLiteralTypeNode(factory.createNull()),
    ])
  else if (column.hasDefaultValue || column.isAutoIncrementing) {
    if (importsMap.has('kysely')) {
      const kyselyImports = importsMap.get('kysely')!
      kyselyImports.add(kyselyGeneratedImportSpecifier)
      importsMap.set('kysely', kyselyImports)
    } else {
      importsMap.set('kysely', new Set([kyselyGeneratedImportSpecifier]))
    }

    const node =
      typeDeclarationsMap.get(
        ((type as TypeReferenceNode).typeName as Identifier)
          ?.escapedText as string,
      )?.type ?? type
    const hasColumnType =
      isTypeReferenceNode(node) &&
      (node.typeName as Identifier).escapedText ===
        kyselyColumnTypeIdentifier.escapedText
    // Unwrap declarations already contained in `ColumnType`
    if (hasColumnType) {
      if (!typeDeclarationsMap.has(unwrapColumnTypeIdentifier.escapedText!))
        typeDeclarationsMap.set(
          unwrapColumnTypeIdentifier.escapedText!,
          unwrapColumnTypeTypeAlias,
        )
      columnTypeNode = factory.createTypeReferenceNode(
        kyselyGeneratedIdentifier,
        [factory.createTypeReferenceNode(unwrapColumnTypeIdentifier, [type])],
      )
    } else
      columnTypeNode = factory.createTypeReferenceNode(
        kyselyGeneratedIdentifier,
        [type],
      )
  } else columnTypeNode = type

  // Create property
  return factory.createPropertySignature(
    undefined,
    column.name,
    undefined,
    columnTypeNode,
  )
}

function createWrapperTypeAlias(
  tableTypeName: string,
  tableTypeIdentifier: Identifier,
  type: 'insertable' | 'selectable' | 'updateable',
) {
  let identifier: Identifier
  if (type === 'insertable') identifier = kyselyInsertableIdentifier
  else if (type === 'selectable') identifier = kyselySelectableIdentifier
  else identifier = kyselyUpdateableIdentifier
  return factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`${tableTypeName}${capitalCase(type)}`),
    undefined,
    factory.createTypeReferenceNode(identifier, [
      factory.createTypeReferenceNode(tableTypeIdentifier, undefined),
    ]),
  )
}
