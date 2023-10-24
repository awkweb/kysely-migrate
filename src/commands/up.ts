import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { spinner } from '@clack/prompts'
import type { MigrationResultSet } from 'kysely'
import pc from 'picocolors'

import { findConfig } from '../utils/findConfig.js'
import { getAppliedMigrationsCount } from '../utils/getAppliedMigrationsCount.js'
import { loadConfig } from '../utils/loadConfig.js'
import { logResultSet } from '../utils/logResultSet.js'

export type UpOptions = {
  config?: string | undefined
  latest?: boolean | undefined
  root?: string | undefined
}

export async function up(options: UpOptions) {
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
  const pendingMigrations = migrations.filter((m) => !m.executedAt)

  if (pendingMigrations.length === 0) return 'No pending migrations.'

  const s = spinner()
  s.start('Running migrations')
  await sleep(500) // so spinner has a chance :)

  let resultSet: MigrationResultSet
  if (options.latest) resultSet = await config.migrator.migrateToLatest()
  else resultSet = await config.migrator.migrateUp()

  const { error, results = [] } = resultSet
  s.stop('Ran migrations', error ? 1 : 0)

  logResultSet(resultSet)
  return getAppliedMigrationsCount(results)
}
