import { capitalCase } from 'change-case'
import { type ColumnMetadata, type TableMetadata } from 'kysely'
import ts from 'typescript'

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
  const importsMap: Map<string, Set<ts.ImportSpecifier>> = new Map()
  const typeDeclarationsMap: Map<string, ts.TypeAliasDeclaration> = new Map()

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

    // TODO: Handle schemas
    // https://kysely.dev/docs/recipes/schemas
    // Create table type alias
    const tableTypeName = capitalCase(table.name)
    const tableTypeIdentifier = ts.factory.createIdentifier(tableTypeName)
    const tableTypeAlias = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      tableTypeIdentifier,
      undefined,
      ts.factory.createTypeLiteralNode(columnProperties),
    )
    nodes.push(tableTypeAlias)

    // Create `Selectable`, `Insertable` and `Updateable` wrappers for table type
    if (importsMap.has('kysely')) {
      const kyselyImports = importsMap.get('kysely')!
      kyselyImports.add(kyselySelectableImportSpecifier)
      if (!table.isView) {
        kyselyImports.add(kyselyInsertableImportSpecifier)
        kyselyImports.add(kyselyUpdateableImportSpecifier)
      }
      importsMap.set('kysely', kyselyImports)
    } else
      importsMap.set(
        'kysely',
        new Set([
          kyselySelectableImportSpecifier,
          ...(table.isView
            ? []
            : [
                kyselyInsertableImportSpecifier,
                kyselyUpdateableImportSpecifier,
              ]),
        ]),
      )

    const insertableTypeAlias = createWrapperTypeAlias(
      tableTypeName,
      tableTypeIdentifier,
      'insertable',
    )
    nodes.push(insertableTypeAlias)
    if (!table.isView) {
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
      nodes.push(selectableTypeAlias, updateableTypeAlias)
    }

    // Create table type property for encompassing `DB` type
    const tableDbTypeParameter = ts.factory.createPropertySignature(
      undefined,
      table.name,
      undefined,
      ts.factory.createTypeReferenceNode(tableTypeIdentifier, undefined),
    )
    dbTypeParameters.push(tableDbTypeParameter)
  }

  // Add in type declarations
  nodes.unshift(...typeDeclarationsMap.values())

  // Add imports statement to start of nodes
  for (const [name, imports] of importsMap.entries()) {
    const importDeclaration = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([...imports.values()]),
      ),
      ts.factory.createStringLiteral(name),
      undefined,
    )
    nodes.unshift(importDeclaration)
  }

  // Create `DB` type alias
  const dbNode = ts.factory.createInterfaceDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('DB'),
    undefined,
    undefined,
    dbTypeParameters,
  )
  nodes.push(dbNode)

  // Print and combine all nodes
  let content = '/** generated by kysely-migrate */\n'
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  for (const node of nodes) {
    content += printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
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
  importsMap: Map<string, Set<ts.ImportSpecifier>>,
  typeDeclarationsMap: Map<string, ts.TypeAliasDeclaration>,
) {
  let dataType: keyof typeof definitions = column.dataType
  // postgres enums have `dataType` set to enum object
  if (enums.has(`${table.schema}.${column.dataType}`)) dataType = 'enum'

  // Get type from lookup
  let type: ts.TypeNode
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
  } else type = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)

  // Create node based on properties (e.g. nullable, default)
  let columnTypeNode: ts.TypeNode
  if (column.isNullable)
    columnTypeNode = ts.factory.createUnionTypeNode([
      type,
      ts.factory.createLiteralTypeNode(ts.factory.createNull()),
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
        ((type as ts.TypeReferenceNode).typeName as ts.Identifier)
          ?.escapedText as string,
      )?.type ?? type
    const hasColumnType =
      ts.isTypeReferenceNode(node) &&
      (node.typeName as ts.Identifier).escapedText ===
        kyselyColumnTypeIdentifier.escapedText
    // Unwrap declarations already contained in `ColumnType`
    if (hasColumnType) {
      if (!typeDeclarationsMap.has(unwrapColumnTypeIdentifier.escapedText!))
        typeDeclarationsMap.set(
          unwrapColumnTypeIdentifier.escapedText!,
          unwrapColumnTypeTypeAlias,
        )
      columnTypeNode = ts.factory.createTypeReferenceNode(
        kyselyGeneratedIdentifier,
        [
          ts.factory.createTypeReferenceNode(unwrapColumnTypeIdentifier, [
            type,
          ]),
        ],
      )
    } else
      columnTypeNode = ts.factory.createTypeReferenceNode(
        kyselyGeneratedIdentifier,
        [type],
      )
  } else columnTypeNode = type

  // Create property
  return ts.factory.createPropertySignature(
    undefined,
    column.name,
    undefined,
    columnTypeNode,
  )
}

function createWrapperTypeAlias(
  tableTypeName: string,
  tableTypeIdentifier: ts.Identifier,
  type: 'insertable' | 'selectable' | 'updateable',
) {
  let identifier: ts.Identifier
  if (type === 'insertable') identifier = kyselyInsertableIdentifier
  else if (type === 'selectable') identifier = kyselySelectableIdentifier
  else identifier = kyselyUpdateableIdentifier
  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${tableTypeName}${capitalCase(type)}`),
    undefined,
    ts.factory.createTypeReferenceNode(identifier, [
      ts.factory.createTypeReferenceNode(tableTypeIdentifier, undefined),
    ]),
  )
}
