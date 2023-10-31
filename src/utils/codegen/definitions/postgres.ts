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
import { type DefinitionNode, type Definitions } from '../types.js'

const json = {
  imports: { kysely: [kyselyColumnTypeImportSpecifier] },
  declarations: [
    jsonTypeAlias,
    jsonValueTypeAlias,
    jsonArrayTypeAlias,
    jsonObjectTypeAlias,
  ],
  value: ts.factory.createTypeReferenceNode(jsonIdentifier, undefined),
} satisfies DefinitionNode

const timestamp = {
  imports: { kysely: [kyselyColumnTypeImportSpecifier] },
  declarations: [],
  value: ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier('Date'),
      undefined,
    ),
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('Date'),
        undefined,
      ),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    ]),
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('Date'),
        undefined,
      ),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    ]),
  ]),
} satisfies DefinitionNode

export const postgresDefinitions = {
  bit: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  bool: ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
  box: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  bpchar: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  bytea: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  cidr: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  date: timestamp,
  enum(column, table, enums) {
    const values = enums.get(`${table.schema}.${column.dataType}`)?.sort()
    if (!values)
      return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword)
    return ts.factory.createUnionTypeNode(
      values.map((value) =>
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value)),
      ),
    )
  },
  float4: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  float8: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  inet: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  int2: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  int4: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  int8: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [],
    value: ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword),
      ]),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword),
      ]),
    ]),
  },
  json,
  jsonb: json,
  line: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  lseg: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  macaddr: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  money: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  numeric: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [],
    value: ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      ]),
      ts.factory.createUnionTypeNode([
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      ]),
    ]),
  },
  oid: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  path: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  polygon: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  serial: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  text: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  time: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  timestamp,
  timestamptz: timestamp,
  tsquery: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  tsvector: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  txid_snapshot: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  uuid: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  varbit: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  varchar: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  xml: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
} satisfies Definitions
