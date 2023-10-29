import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { cancel, isCancel, select } from '@clack/prompts'
import pc from 'picocolors'

import { spinner } from '../utils/clack.js'
import { findConfig } from '../utils/findConfig.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { getMigrator } from '../utils/getMigrator.js'
import { loadConfig } from '../utils/loadConfig.js'
import { logResultSet } from '../utils/logResultSet.js'

export type ToOptions = {
  config?: string | undefined
  name?: string | undefined
  root?: string | undefined
}

export async function to(options: ToOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()

  if (migrations.length === 0) return 'No migrations.'
  if (migrations.length === 1) return 'No enough migrations.'

  let migration: string | symbol
  if (options.name) migration = options.name
  else {
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

  const s = spinner(config._spinnerMs)
  await s.start('Running migrations')

  const resultSet = await migrator.migrateTo(migration as string)

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  logResultSet(resultSet)

  if (error) throw new Error('Failed running migrations.')
  return getAppliedMigrationsCount(results)
}
