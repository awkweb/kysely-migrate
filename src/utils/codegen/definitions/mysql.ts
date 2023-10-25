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
import { type Definitions } from '../types.js'

// TODO: Complete definitions
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
  // decimal: new IdentifierNode('Decimal'),
  double: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  float: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  // geomcollection: new ArrayExpressionNode(new IdentifierNode('Geometry')), // Specified as "geometrycollection" in Adminer.
  // geometry: new IdentifierNode('Geometry'),
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
  // linestring: new IdentifierNode('LineString'),
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
  // multilinestring: new ArrayExpressionNode(new IdentifierNode('LineString')),
  // multipoint: new ArrayExpressionNode(new IdentifierNode('Point')),
  // multipolygon: new ArrayExpressionNode(new IdentifierNode('Polygon')),
  // point: new IdentifierNode('Point'),
  // polygon: new IdentifierNode('Polygon'),
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
