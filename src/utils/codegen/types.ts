import { type ColumnMetadata, type TableMetadata } from 'kysely'
import ts from 'typescript'

import { type Config } from '../../config.js'

export type Dialect = NonNullable<NonNullable<Config['codegen']>['dialect']>

export type Definitions<key extends string = string> = Record<
  key,
  | ts.TypeNode
  | DefinitionNode
  | ((
      column: ColumnMetadata,
      table: TableMetadata,
      enums: Map<string, string[]>,
    ) => ts.TypeNode)
>

export type DefinitionNode = {
  imports: { [key in 'kysely' | string]: readonly ts.ImportSpecifier[] }
  declarations: readonly ts.TypeAliasDeclaration[]
  value: ts.TypeNode
}
