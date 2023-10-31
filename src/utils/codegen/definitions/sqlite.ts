import ts from 'typescript'

import { type Definitions } from '../types.js'

export const sqliteDefinitions = {
  any: ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
  blob: ts.factory.createTypeReferenceNode(
    ts.factory.createIdentifier('Buffer'),
    undefined,
  ),
  boolean: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  integer: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  numeric: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  real: ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  text: ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
} satisfies Definitions
