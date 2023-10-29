import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { type MigrationResultSet } from 'kysely'

import { spinner } from '../utils/clack.js'
import { findConfig } from '../utils/findConfig.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { getMigrator } from '../utils/getMigrator.js'
import { loadConfig } from '../utils/loadConfig.js'
import { logResultSet } from '../utils/logResultSet.js'

export type UpOptions = {
  config?: string | undefined
  latest?: boolean | undefined
  root?: string | undefined
}

export async function up(options: UpOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()
  const pendingMigrations = migrations.filter((m) => !m.executedAt)

  if (pendingMigrations.length === 0) return 'No pending migrations.'

  const s = spinner(config._spinnerMs)
  await s.start('Running migrations')

  let resultSet: MigrationResultSet
  if (options.latest) resultSet = await migrator.migrateToLatest()
  else resultSet = await migrator.migrateUp()

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  logResultSet(resultSet)

  if (error) throw new Error('Failed running migrations.')
  return getAppliedMigrationsCount(results)
}
