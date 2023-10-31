import ts from 'typescript'

export const kyselyColumnTypeIdentifier =
  ts.factory.createIdentifier('ColumnType')
export const kyselyColumnTypeImportSpecifier = ts.factory.createImportSpecifier(
  true,
  undefined,
  kyselyColumnTypeIdentifier,
)

export const kyselyGeneratedIdentifier =
  ts.factory.createIdentifier('Generated')
export const kyselyGeneratedImportSpecifier = ts.factory.createImportSpecifier(
  true,
  undefined,
  kyselyGeneratedIdentifier,
)

export const kyselyInsertableIdentifier =
  ts.factory.createIdentifier('Insertable')
export const kyselyInsertableImportSpecifier = ts.factory.createImportSpecifier(
  true,
  undefined,
  kyselyInsertableIdentifier,
)

export const kyselySelectableIdentifier =
  ts.factory.createIdentifier('Selectable')
export const kyselySelectableImportSpecifier = ts.factory.createImportSpecifier(
  true,
  undefined,
  kyselySelectableIdentifier,
)

export const kyselyUpdateableIdentifier =
  ts.factory.createIdentifier('Updateable')
export const kyselyUpdateableImportSpecifier = ts.factory.createImportSpecifier(
  true,
  undefined,
  kyselyUpdateableIdentifier,
)

export const jsonIdentifier = ts.factory.createIdentifier('Json')
export const jsonValueIdentifier = ts.factory.createIdentifier('JsonValue')
export const jsonArrayIdentifier = ts.factory.createIdentifier('JsonArray')
export const jsonObjectIndentifier = ts.factory.createIdentifier('JsonObject')

export const jsonTypeAlias = ts.factory.createTypeAliasDeclaration(
  [],
  jsonIdentifier,
  undefined,
  ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
    ts.factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  ]),
)

export const jsonValueTypeAlias = ts.factory.createTypeAliasDeclaration(
  [],
  jsonValueIdentifier,
  undefined,
  ts.factory.createUnionTypeNode([
    ts.factory.createTypeReferenceNode(jsonArrayIdentifier, undefined),
    ts.factory.createTypeReferenceNode(jsonObjectIndentifier, undefined),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
    ts.factory.createLiteralTypeNode(ts.factory.createNull()),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
  ]),
)

export const jsonArrayTypeAlias = ts.factory.createTypeAliasDeclaration(
  [],
  jsonArrayIdentifier,
  undefined,
  ts.factory.createArrayTypeNode(
    ts.factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
  ),
)

export const jsonObjectTypeAlias = ts.factory.createTypeAliasDeclaration(
  [],
  jsonObjectIndentifier,
  undefined,
  ts.factory.createMappedTypeNode(
    undefined,
    ts.factory.createTypeParameterDeclaration(
      undefined,
      ts.factory.createIdentifier('key'),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      undefined,
    ),
    undefined,
    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(jsonValueIdentifier, undefined),
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
    ]),
    undefined,
  ),
)

const columnIdentifier = ts.factory.createIdentifier('c')
const selectIdentifier = ts.factory.createIdentifier('s')
const insertIdentifier = ts.factory.createIdentifier('i')
const updateIdentifier = ts.factory.createIdentifier('u')

export const unwrapColumnTypeIdentifier =
  ts.factory.createIdentifier('UnwrapColumnType')
export const unwrapColumnTypeTypeAlias = ts.factory.createTypeAliasDeclaration(
  [],
  unwrapColumnTypeIdentifier,
  [
    ts.factory.createTypeParameterDeclaration(
      undefined,
      columnIdentifier,
      undefined,
      undefined,
    ),
  ],
  ts.factory.createConditionalTypeNode(
    ts.factory.createTypeReferenceNode(columnIdentifier, undefined),
    ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createInferTypeNode(
        ts.factory.createTypeParameterDeclaration(
          undefined,
          selectIdentifier,
          undefined,
          undefined,
        ),
      ),
      ts.factory.createInferTypeNode(
        ts.factory.createTypeParameterDeclaration(
          undefined,
          insertIdentifier,
          undefined,
          undefined,
        ),
      ),
      ts.factory.createInferTypeNode(
        ts.factory.createTypeParameterDeclaration(
          undefined,
          updateIdentifier,
          undefined,
          undefined,
        ),
      ),
    ]),
    ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createTypeReferenceNode(selectIdentifier, undefined),
      ts.factory.createUnionTypeNode([
        ts.factory.createTypeReferenceNode(insertIdentifier, undefined),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
      ]),
      ts.factory.createTypeReferenceNode(updateIdentifier, undefined),
    ]),
    ts.factory.createTypeReferenceNode(kyselyColumnTypeIdentifier, [
      ts.factory.createTypeReferenceNode(columnIdentifier, undefined),
      ts.factory.createUnionTypeNode([
        ts.factory.createTypeReferenceNode(columnIdentifier, undefined),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
      ]),
      ts.factory.createTypeReferenceNode(columnIdentifier, undefined),
    ]),
  ),
)
