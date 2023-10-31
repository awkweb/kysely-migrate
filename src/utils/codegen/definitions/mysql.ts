import ts from 'typescript'

import {
  jsonArrayTypeAlias,
  jsonIdentifier,
  jsonObjectTypeAlias,
  jsonTypeAlias,
  jsonValueTypeAlias,
  kyselyColumnTypeIdentifier,
  kyselyColumnTypeImportSpecifier,
} from '../declarations.js'
import { type Definitions } from '../types.js'

export const mysqlDefinitions = {
  bigint: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  binary: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  bit: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  blob: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  char: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  date: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Date'),
    undefined,
  ),
  datetime: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Date'),
    undefined,
  ),
  decimal: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [],
    value: ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ]),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ]),
    ]),
  },
  double: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  enum(column, table, enums) {
    const values = enums.get(`${table.schema}.${table.name}.${column.name}`)
    if (!values)
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
    return ts.factory.createUnionTypeNode(
      values.map((value) =>
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value)),
      ),
    )
  },
  float: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  int: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  json: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [
      jsonTypeAlias,
      jsonValueTypeAlias,
      jsonArrayTypeAlias,
      jsonObjectTypeAlias,
    ],
    value: ts.factory.createTypeReferenceNode(jsonIdentifier, undefined),
  },
  longblob: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  longtext: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  mediumblob: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  mediumint: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  mediumtext: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  smallint: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  text: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  time: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  timestamp: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Date'),
    undefined,
  ),
  tinyblob: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  tinyint: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  tinytext: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  varbinary: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  varchar: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  year: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
} satisfies Definitions
