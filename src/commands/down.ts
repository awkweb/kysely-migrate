import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { cancel, confirm, isCancel } from '@clack/prompts'
import { type MigrationResultSet, NO_MIGRATIONS } from 'kysely'

import { type Config } from '../config.js'
import { spinner } from '../utils/clack.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { getMigrator } from '../utils/getMigrator.js'
import { logResultSet } from '../utils/logResultSet.js'

export type DownOptions = {
  reset?: boolean | undefined
  silent?: boolean | undefined
}

export async function down(config: Config, options: DownOptions = {}) {
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()
  const executedMigrations = migrations.filter((m) => m.executedAt)

  if (executedMigrations.length === 0) return 'No migrations executed.'

  if (!options.silent && options.reset) {
    const shouldContinue = await confirm({
      message: 'Do you want to continue and reset all migrations?',
    })
    if (isCancel(shouldContinue)) {
      cancel('Operation cancelled')
      return process.exit(0)
    }
    if (!shouldContinue) return 'Applied 0 migrations.'
  }

  const s = spinner(config._spinnerMs, options.silent)
  await s.start('Running migrations')

  let resultSet: MigrationResultSet
  if (options.reset) resultSet = await migrator.migrateTo(NO_MIGRATIONS)
  else resultSet = await migrator.migrateDown()

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  if (options.silent) return

  logResultSet(resultSet)

  if (error) throw new Error('Failed running migrations.')
  return getAppliedMigrationsCount(results)
}
