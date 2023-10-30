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
import { type DefinitionNode, type Definitions } from '../types.js'

const json = {
  imports: { kysely: [kyselyColumnTypeImportSpecifier] },
  declarations: [
    jsonTypeAlias,
    jsonValueTypeAlias,
    jsonArrayTypeAlias,
    jsonObjectTypeAlias,
    jsonPrimitiveTypeAlias,
  ],
  value: factory.createTypeReferenceNode(jsonIdentifier, undefined),
} satisfies DefinitionNode

const timestamp = {
  imports: { kysely: [kyselyColumnTypeImportSpecifier] },
  declarations: [],
  value: factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    factory.createTypeReferenceNode(
      factory.createIdentifier('Date'),
      undefined,
    ),
    factory.createUnionTypeNode([
      factory.createTypeReferenceNode(
        factory.createIdentifier('Date'),
        undefined,
      ),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ]),
    factory.createUnionTypeNode([
      factory.createTypeReferenceNode(
        factory.createIdentifier('Date'),
        undefined,
      ),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    ]),
  ]),
} satisfies DefinitionNode

export const postgresDefinitions = {
  bit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bool: factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
  box: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bpchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bytea: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  cidr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  date: timestamp,
  enum(column, table, enums) {
    const values = enums.get(`${table.schema}.${column.name}`)
    if (!values) return factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword)
    return factory.createUnionTypeNode(
      values.map((value) =>
        factory.createLiteralTypeNode(factory.createStringLiteral(value)),
      ),
    )
  },
  float4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  float8: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  inet: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  int2: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  int4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  int8: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [],
    value: factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
        factory.createKeywordTypeNode(SyntaxKind.BigIntKeyword),
      ]),
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
        factory.createKeywordTypeNode(SyntaxKind.BigIntKeyword),
      ]),
    ]),
  },
  json,
  jsonb: json,
  line: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  lseg: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  macaddr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  money: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  numeric: {
    imports: { kysely: [kyselyColumnTypeImportSpecifier] },
    declarations: [],
    value: factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
      ]),
      factory.createUnionTypeNode([
        factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
        factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
      ]),
    ]),
  },
  oid: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  path: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  polygon: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  text: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  time: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  timestamp,
  timestampz: timestamp,
  tsquery: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  tsvector: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  txid_snapshot: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  uuid: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varbit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  xml: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
} satisfies Definitions
