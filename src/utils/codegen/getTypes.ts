import { capitalCase } from 'change-case'
import { type TableMetadata } from 'kysely'
import {
  EmitHint,
  type ImportSpecifier,
  NewLineKind,
  ScriptTarget,
  SyntaxKind,
  type TypeAliasDeclaration,
  type TypeNode,
  createPrinter,
  createSourceFile,
  factory,
} from 'typescript'

import {
  generatedIdentifier,
  generatedTypeAlias,
  kyselyColumnTypeImportSpecifier,
} from './declarations.js'
import { mysqlDefinitions } from './definitions/mysql.js'
import { postgresDefinitions } from './definitions/postgres.js'
import { sqliteDefinitions } from './definitions/sqlite.js'
import { type DefinitionNode, type Definitions, type Dialect } from './types.js'

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
  dialect: Dialect | undefined,
  customDefinitions: Definitions | undefined = {},
) {
  // TODO: Parse out enums (https://github.com/RobinBlomberg/kysely-codegen/blob/b749a677e6bfd7370559767e57e4c69746898f94/src/dialects/mysql/mysql-introspector.ts#L28-L46)
  // TODO: Tests for different dialects, custom definitions, table metadata, etc.

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
  const typeDeclarations: Set<TypeAliasDeclaration> = new Set()

  // Create types
  const dbTypeParameters = []
  for (const table of tableMetadata) {
    // Create type property for each column
    const columnProperties = []
    for (const column of table.columns) {
      // Get type from lookup
      let type: TypeNode
      if (column.dataType in definitions) {
        const definition = definitions[
          column.dataType as keyof typeof definitions
        ] as TypeNode | DefinitionNode
        if ('value' in definition) {
          type = definition.value
          for (const [name, imports] of Object.entries(definition.imports)) {
            if (importsMap.has(name)) {
              const nameImports = importsMap.get(name)!
              importsMap.set(name, new Set([...nameImports, ...imports]))
            } else importsMap.set(name, new Set(imports))
          }
          for (const declaration of definition.declarations) {
            typeDeclarations.add(declaration)
          }
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
          kyselyImports.add(kyselyColumnTypeImportSpecifier)
          importsMap.set('kysely', kyselyImports)
        } else {
          importsMap.set('kysely', new Set([kyselyColumnTypeImportSpecifier]))
        }
        typeDeclarations.add(generatedTypeAlias)
        columnTypeNode = factory.createTypeReferenceNode(generatedIdentifier, [
          type,
        ])
      } else columnTypeNode = type

      // Create property
      const columnProperty = factory.createPropertySignature(
        undefined,
        factory.createIdentifier(column.name),
        undefined,
        columnTypeNode,
      )
      columnProperties.push(columnProperty)
    }

    // Create table type alias
    const tableTypeName = capitalCase(table.name)
    const tableTypeIdentifier = factory.createIdentifier(tableTypeName)
    const tableTypeAlias = factory.createTypeAliasDeclaration(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      tableTypeIdentifier,
      undefined,
      factory.createTypeLiteralNode(columnProperties),
    )
    nodes.push(tableTypeAlias)

    // Create table type property for encompassing `DB` type
    const tableDbTypeParameter = factory.createPropertySignature(
      undefined,
      tableTypeIdentifier,
      undefined,
      factory.createTypeReferenceNode(tableTypeIdentifier, undefined),
    )
    dbTypeParameters.push(tableDbTypeParameter)
  }

  // Add in type declarations
  nodes.unshift(...typeDeclarations)

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
  const dbNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier('DB'),
    undefined,
    factory.createTypeLiteralNode(dbTypeParameters),
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
