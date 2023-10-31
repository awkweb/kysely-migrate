import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { type MigrationResultSet } from 'kysely'

import { type Config } from '../config.js'
import { spinner } from '../utils/clack.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { getMigrator } from '../utils/getMigrator.js'
import { logResultSet } from '../utils/logResultSet.js'

export type UpOptions = {
  latest?: boolean | undefined
  silent?: boolean | undefined
}

export async function up(config: Config, options: UpOptions = {}) {
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()
  const pendingMigrations = migrations.filter((m) => !m.executedAt)

  if (pendingMigrations.length === 0) return 'No pending migrations.'

  const s = spinner(config._spinnerMs, options.silent)
  await s.start('Running migrations')

  let resultSet: MigrationResultSet
  if (options.latest) resultSet = await migrator.migrateToLatest()
  else resultSet = await migrator.migrateUp()

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  if (options.silent) return

  logResultSet(resultSet)

  if (error) throw new Error('Failed running migrations.')
  return getAppliedMigrationsCount(results)
}
