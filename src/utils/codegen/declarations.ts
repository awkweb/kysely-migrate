import { SyntaxKind, factory } from 'typescript'

export const kyselyColumnTypeIdentifier = factory.createIdentifier('ColumnType')
export const kyselyColumnTypeImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyColumnTypeIdentifier,
)

export const generatedIdentifier = factory.createIdentifier('Generated')
export const generatedTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  generatedIdentifier,
  [
    factory.createTypeParameterDeclaration(
      undefined,
      factory.createIdentifier('columnType'),
      undefined,
      undefined,
    ),
  ],
  factory.createConditionalTypeNode(
    factory.createTypeReferenceNode(
      factory.createIdentifier('columnType'),
      undefined,
    ),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('selectType'),
          undefined,
          undefined,
        ),
      ),
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('insertType'),
          undefined,
          undefined,
        ),
      ),
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          factory.createIdentifier('updateType'),
          undefined,
          undefined,
        ),
      ),
    ]),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createTypeReferenceNode(
        factory.createIdentifier('selectType'),
        undefined,
      ),
      factory.createUnionTypeNode([
        factory.createTypeReferenceNode(
          factory.createIdentifier('insertType'),
          undefined,
        ),
        factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
      ]),
      factory.createTypeReferenceNode(
        factory.createIdentifier('updateType'),
        undefined,
      ),
    ]),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createTypeReferenceNode(
        factory.createIdentifier('columnType'),
        undefined,
      ),
      factory.createUnionTypeNode([
        factory.createTypeReferenceNode(
          factory.createIdentifier('columnType'),
          undefined,
        ),
        factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
      ]),
      factory.createTypeReferenceNode(
        factory.createIdentifier('columnType'),
        undefined,
      ),
    ]),
  ),
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
