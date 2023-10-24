import { Migrator } from 'kysely'

export type Config = {
  migrator: Migrator
  out: string
}

export function defineConfig(
  config: Config | (() => Config | Promise<Config>),
) {
  return config
}

export const defaultConfig = {}
