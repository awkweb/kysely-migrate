import { SyntaxKind, factory } from 'typescript'

export const kyselyColumnTypeIdentifier = factory.createIdentifier('ColumnType')
export const kyselyColumnTypeImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyColumnTypeIdentifier,
)

export const kyselyGeneratedIdentifier = factory.createIdentifier('Generated')
export const kyselyGeneratedImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyGeneratedIdentifier,
)

export const kyselyInsertableIdentifier = factory.createIdentifier('Insertable')
export const kyselyInsertableImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyInsertableIdentifier,
)

export const kyselySelectableIdentifier = factory.createIdentifier('Selectable')
export const kyselySelectableImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselySelectableIdentifier,
)

export const kyselyUpdateableIdentifier = factory.createIdentifier('Updateable')
export const kyselyUpdateableImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyUpdateableIdentifier,
)

export const jsonIdentifier = factory.createIdentifier('Json')
export const jsonValueIdentifier = factory.createIdentifier('JsonValue')
export const jsonArrayIdentifier = factory.createIdentifier('JsonArray')
export const jsonObjectIndentifier = factory.createIdentifier('JsonObject')
export const jsonPrimitiveIdentifier = factory.createIdentifier('JsonPrimitive')

export const jsonTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  jsonIdentifier,
  undefined,
  factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  ]),
)

export const jsonValueTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  jsonValueIdentifier,
  undefined,
  factory.createUnionTypeNode([
    factory.createTypeReferenceNode(jsonArrayIdentifier, undefined),
    factory.createTypeReferenceNode(jsonObjectIndentifier, undefined),
    factory.createTypeReferenceNode(jsonPrimitiveIdentifier, undefined),
  ]),
)

export const jsonArrayTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  jsonArrayIdentifier,
  undefined,
  factory.createArrayTypeNode(
    factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
  ),
)

export const jsonObjectTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  jsonObjectIndentifier,
  undefined,
  factory.createMappedTypeNode(
    undefined,
    factory.createTypeParameterDeclaration(
      undefined,
      factory.createIdentifier('key'),
      factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
      undefined,
    ),
    undefined,
    factory.createToken(SyntaxKind.QuestionToken),
    factory.createUnionTypeNode([
      factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
      factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
    ]),
    undefined,
  ),
)

export const jsonPrimitiveTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  jsonPrimitiveIdentifier,
  undefined,
  factory.createUnionTypeNode([
    factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
    factory.createLiteralTypeNode(factory.createNull()),
    factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  ]),
)
