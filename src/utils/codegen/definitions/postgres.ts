import { SyntaxKind, factory } from 'typescript'

import {
  jsonArrayTypeAlias,
  jsonIdentifier,
  jsonObjectTypeAlias,
  jsonPrimitiveTypeAlias,
  jsonTypeAlias,
  jsonValueTypeAlias,
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

// TODO: Complete definitions
// bool, circle, date, int8, interval, numeric, point, timestamp, timestamptz
export const postgresDefinitions = {
  bit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  box: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bpchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bytea: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  cidr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  float4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  float8: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  inet: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  int2: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  int4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  json,
  jsonb: json,
  line: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  lseg: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  macaddr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  money: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  oid: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  path: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  polygon: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  text: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  time: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  tsquery: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  tsvector: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  txid_snapshot: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  uuid: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varbit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  xml: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
} satisfies Definitions
