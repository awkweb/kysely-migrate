import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { cancel, isCancel, select } from '@clack/prompts'
import pc from 'picocolors'

import { type Config } from '../config.js'
import { spinner } from '../utils/clack.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { getMigrator } from '../utils/getMigrator.js'
import { logResultSet } from '../utils/logResultSet.js'

export type ToOptions = {
  name?: string | undefined
  silent?: boolean | undefined
}

export async function to(config: Config, options: ToOptions) {
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()

  if (migrations.length === 0) throw new Error('No migrations.')
  if (migrations.length === 1)
    throw new Error('Must have more than one migration.')

  let migration: string | symbol
  if (options.name) migration = options.name
  else {
    if (options.silent) throw new Error('--name required when using --silent.')

    const lastExecutedMigration = migrations
      .filter((migration) => migration.executedAt)
      .at(-1)
    const lastExecutedMigrationIndex = lastExecutedMigration
      ? migrations.findIndex(
          (migration) => migration.name === lastExecutedMigration.name,
        )
      : -1

    migration = await select({
      message: `Pick a migration to target.${
        lastExecutedMigration
          ? pc.gray(` Current: ${lastExecutedMigration.name}`)
          : ''
      }`,
      options: migrations
        .map((migration, index) => ({
          label: `${migration.name}${
            lastExecutedMigrationIndex > index ? '.down' : '.up'
          }`,
          value: migration.name,
          ...(migration.executedAt
            ? { hint: migration.executedAt.toISOString() }
            : {}),
        }))
        .filter((option) => option.value !== lastExecutedMigration?.name),
    })

    if (isCancel(migration)) {
      cancel('Operation cancelled')
      return process.exit(0)
    }
  }

  const s = spinner(config._spinnerMs, options.silent)
  await s.start('Running migrations')

  const resultSet = await migrator.migrateTo(migration)

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  if (options.silent) return

  logResultSet(resultSet)

  if (error) throw new Error('Failed running migrations.')
  return getAppliedMigrationsCount(results)
}
