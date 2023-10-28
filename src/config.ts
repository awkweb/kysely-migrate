import {
  type FileMigrationProviderFS,
  type FileMigrationProviderPath,
  type Kysely,
  Migrator,
} from 'kysely'

import { type Definitions } from './utils/codegen/types.js'

export type Config = {
  codegen?: Evaluate<Codegen> | undefined
  db: Kysely<any>
  fs?: FileMigrationProviderFS | undefined
  path?: FileMigrationProviderPath | undefined
  migrationFolder: string
  migrator?: Migrator | undefined
  _spinnerMs?: number | undefined
}

type Codegen =
  | {
      definitions?: Evaluate<Definitions> | undefined
      dialect: 'mysql' | 'postgres' | 'sqlite'
      out: string
    }
  | {
      definitions: Evaluate<Definitions> | undefined
      dialect?: 'mysql' | 'postgres' | 'sqlite' | undefined
      out: string
    }

export function defineConfig(
  config:
    | Evaluate<Config>
    | (() => Evaluate<Config> | Promise<Evaluate<Config>>),
) {
  return config
}

export const defaultConfig = {}

type Evaluate<type> = { [key in keyof type]: type[key] } & unknown
