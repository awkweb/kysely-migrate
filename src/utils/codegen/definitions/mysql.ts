import { SyntaxKind, factory } from 'typescript'
import {
  jsonArrayTypeAlias,
  jsonIdentifier,
  jsonObjectTypeAlias,
  jsonPrimitiveTypeAlias,
  jsonTypeAlias,
  jsonValueTypeAlias,
  kyselyColumnTypeIdentifier,
  kyselyColumnTypeImportSpecifier,
} from '../declarations.js'
import { type Definitions } from '../types.js'

const decimalIdentifier = factory.createIdentifier('Decimal')
const decimalTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  decimalIdentifier,
  undefined,
  factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    factory.createUnionTypeNode([
      factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ]),
    factory.createUnionTypeNode([
      factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ]),
  ]),
)

export const mysqlDefinitions = {
  bigint: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  binary: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  bit: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  blob: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  char: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  date: factory.createTypeReferenceNode(
    factory.createIdentifier('Date'),
    undefined,
  ),
  datetime: factory.createTypeReferenceNode(
    factory.createIdentifier('Date'),
    undefined,
  ),
  decimal: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [decimalTypeAlias],
    value: factory.createTypeReferenceNode(decimalIdentifier, undefined),
  },
  double: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  enum(column, table, enums) {
    const values = enums.get(`${table.schema}.${table.name}.${column.name}`)
    if (!values) return factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)
    return factory.createUnionTypeNode(
      values.map((value) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(value)),
      ),
    )
  },
  float: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  int: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  json: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [
      jsonTypeAlias,
      jsonValueTypeAlias,
      jsonArrayTypeAlias,
      jsonObjectTypeAlias,
      jsonPrimitiveTypeAlias,
    ],
    value: factory.createTypeReferenceNode(jsonIdentifier, undefined),
  },
  longblob: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  longtext: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  mediumblob: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  mediumint: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  mediumtext: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  set: factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
  smallint: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  text: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  time: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  timestamp: factory.createTypeReferenceNode(
    factory.createIdentifier('Date'),
    undefined,
  ),
  tinyblob: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  tinyint: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  tinytext: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varbinary: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  varchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  year: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
} satisfies Definitions
