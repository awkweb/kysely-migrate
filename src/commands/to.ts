import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { cancel, intro, isCancel, outro, select, spinner } from '@clack/prompts'
import pc from 'picocolors'

import { findConfig } from '../utils/findConfig.js'
import { loadConfig } from '../utils/loadConfig.js'
import { logAppliedMigrationsCount } from '../utils/logAppliedMigrationsCount.js'
import { logResultSet } from '../utils/logResultSet.js'

export type ToOptions = {
  config?: string | undefined
  name?: string | undefined
  root?: string | undefined
}

export async function to(options: ToOptions) {
  intro(pc.inverse(' kysely-migrate '))

  // Get cli config file
  const configPath = await findConfig(options)
  if (!configPath) {
    if (options.config)
      throw new Error(`Config not found at ${pc.gray(options.config)}`)
    throw new Error('Config not found')
  }

  const config = await loadConfig({ configPath })

  const migrationsDir = config.out
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await config.migrator.getMigrations()

  if (migrations.length === 0) {
    outro('No migrations.')
    return process.exit(0)
  }

  if (migrations.length === 1) {
    outro('No enough migrations.')
    return process.exit(0)
  }

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

  const s = spinner()
  s.start('Running migrations')
  await sleep(500) // so spinner has a chance :)

  const resultSet = await config.migrator.migrateTo(migration as string)

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  logResultSet(resultSet)
  logAppliedMigrationsCount(results)

  return process.exit(0)
}
