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

export const jsonTypeAlias = factory.createTypeAliasDeclaration(
  [],
  jsonIdentifier,
  undefined,
  factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  ]),
)

export const jsonValueTypeAlias = factory.createTypeAliasDeclaration(
  [],
  jsonValueIdentifier,
  undefined,
  factory.createUnionTypeNode([
    factory.createTypeReferenceNode(jsonArrayIdentifier, undefined),
    factory.createTypeReferenceNode(jsonObjectIndentifier, undefined),
    factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
    factory.createLiteralTypeNode(factory.createNull()),
    factory.createKeywordTypeNode(SyntaxKind.NumberKeyword),
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
  ]),
)

export const jsonArrayTypeAlias = factory.createTypeAliasDeclaration(
  [],
  jsonArrayIdentifier,
  undefined,
  factory.createArrayTypeNode(
    factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
  ),
)

export const jsonObjectTypeAlias = factory.createTypeAliasDeclaration(
  [],
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

const columnIdentifier = factory.createIdentifier('c')
const selectIdentifier = factory.createIdentifier('s')
const insertIdentifier = factory.createIdentifier('i')
const updateIdentifier = factory.createIdentifier('u')

export const unwrapColumnTypeIdentifier =
  factory.createIdentifier('UnwrapColumnType')
export const unwrapColumnTypeTypeAlias = factory.createTypeAliasDeclaration(
  [],
  unwrapColumnTypeIdentifier,
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
