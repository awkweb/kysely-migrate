import { SyntaxKind, factory } from 'typescript'

import { type Definitions } from '../types.js'

export const sqliteDefinitions = {
  any: factory.createKeywordTypeNode(SyntaxKind.UnknownKeyword),
  blob: factory.createTypeReferenceNode(
    factory.createIdentifier('Buffer'),
    undefined,
  ),
  boolean: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  integer: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  numeric: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  real: factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
  text: factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
} satisfies Definitions
