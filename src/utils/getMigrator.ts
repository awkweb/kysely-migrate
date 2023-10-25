import nodeFs from 'node:fs/promises'
import nodePath from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely'

import { type Config } from '../config.js'

export function getMigrator(config: Config) {
  if ('migrator' in config && config.migrator) return config.migrator

  const { db, fs = nodeFs, path = nodePath } = config
  const migrationFolder = nodePath.resolve(config.migrationFolder)
  const provider = new FileMigrationProvider({ fs, migrationFolder, path })
  return new Migrator({ db, provider })
}
