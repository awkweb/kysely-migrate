import { type ColumnMetadata, type TableMetadata } from 'kysely'
import {
  type ImportSpecifier,
  type TypeAliasDeclaration,
  type TypeNode,
} from 'typescript'

import { type Config } from '../../config.js'

export type Dialect = NonNullable<NonNullable<Config['codegen']>['dialect']>

export type Definitions<key extends string = string> = Record<
  key,
  | TypeNode
  | DefinitionNode
  | ((
      column: ColumnMetadata,
      table: TableMetadata,
      enums: Map<string, string[]>,
    ) => TypeNode)
>

export type DefinitionNode = {
  imports: { [key in 'kysely' | string]: readonly ImportSpecifier[] }
  declarations: readonly TypeAliasDeclaration[]
  value: TypeNode
}
