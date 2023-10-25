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
export const postgresDefinitions = {
  bit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  // bool: new IdentifierNode('boolean'), // Specified as "boolean" in Adminer.
  box: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  bpchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword), // Specified as "character" in Adminer.
  bytea: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  cidr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  // circle: new IdentifierNode('Circle'),
  // date: new IdentifierNode('Timestamp'),
  float4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword), // Specified as "real" in Adminer.
  float8: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword), // Specified as "double precision" in Adminer.
  inet: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  int2: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword), // Specified in 'pg' source code.
  int4: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword), // Specified in 'pg' source code.
  // int8: new IdentifierNode('Int8'), // Specified as "bigint" in Adminer.
  // interval: new IdentifierNode('Interval'),
  json,
  jsonb: json,
  line: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  lseg: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  macaddr: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  money: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  // numeric: new IdentifierNode('Numeric'),
  oid: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword), // Specified in 'pg' source code.
  path: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  // point: new IdentifierNode('Point'),
  polygon: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  text: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  time: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  // timestamp: new IdentifierNode('Timestamp'),
  // timestamptz: new IdentifierNode('Timestamp'),
  tsquery: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  tsvector: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  txid_snapshot: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  uuid: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  varbit: factory.createKeywordTypeNode(SyntaxKind.StringKeyword), // Specified as "bit varying" in Adminer.
  varchar: factory.createKeywordTypeNode(SyntaxKind.StringKeyword), // Specified as "character varying" in Adminer.
  xml: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
} satisfies Definitions
