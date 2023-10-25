import { SyntaxKind, factory } from 'typescript'

export const kyselyColumnTypeIdentifier = factory.createIdentifier('ColumnType')
export const kyselyColumnTypeImportSpecifier = factory.createImportSpecifier(
  true,
  undefined,
  kyselyColumnTypeIdentifier,
)

const columnIdentifier = factory.createIdentifier('c')
const selectIdentifier = factory.createIdentifier('s')
const insertIdentifier = factory.createIdentifier('i')
const updateIdentifier = factory.createIdentifier('i')

export const generatedIdentifier = factory.createIdentifier('Generated')
export const generatedTypeAlias = factory.createTypeAliasDeclaration(
  [factory.createToken(SyntaxKind.ExportKeyword)],
  generatedIdentifier,
  [
    factory.createTypeParameterDeclaration(
      undefined,
      columnIdentifier,
      undefined,
      undefined,
    ),
  ],
  factory.createConditionalTypeNode(
    factory.createTypeReferenceNode(columnIdentifier, undefined),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          selectIdentifier,
          undefined,
          undefined,
        ),
      ),
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          insertIdentifier,
          undefined,
          undefined,
        ),
      ),
      factory.createInferTypeNode(
        factory.createTypeParameterDeclaration(
          undefined,
          updateIdentifier,
          undefined,
          undefined,
        ),
      ),
    ]),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createTypeReferenceNode(selectIdentifier, undefined),
      factory.createUnionTypeNode([
        factory.createTypeReferenceNode(insertIdentifier, undefined),
        factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
      ]),
      factory.createTypeReferenceNode(updateIdentifier, undefined),
    ]),
    factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      factory.createTypeReferenceNode(columnIdentifier, undefined),
      factory.createUnionTypeNode([
        factory.createTypeReferenceNode(columnIdentifier, undefined),
        factory.createKeywordTypeNode(SyntaxKind.UndefinedKeyword),
      ]),
      factory.createTypeReferenceNode(columnIdentifier, undefined),
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
