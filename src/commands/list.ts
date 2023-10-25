import pc from 'picocolors'

import { S_BAR, S_INFO, S_SUCCESS, message } from '../utils/clack.js'
import { findConfig } from '../utils/findConfig.js'
import { getMigrator } from '../utils/getMigrator.js'
import { loadConfig } from '../utils/loadConfig.js'

export type ListOptions = {
  config?: string | undefined
  root?: string | undefined
}

export async function list(options: ListOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })
  const migrator = getMigrator(config)

  const migrations = await migrator.getMigrations()
  const migrationsCount = migrations.length

  process.stdout.write(`${pc.gray(S_BAR)}\n`)

  for (const migration of migrations) {
    if (migration.executedAt)
      message(
        `${migration.name} ${pc.dim(migration.executedAt.toISOString())}`,
        { symbol: pc.green(S_SUCCESS) },
      )
    else message(migration.name, { symbol: pc.blue(S_INFO) })
  }

  return `Found ${migrationsCount} ${
    migrationsCount === 1 ? 'migration' : 'migrations'
  }.`
}
