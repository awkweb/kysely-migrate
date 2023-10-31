import pc from 'picocolors'

import type { Config } from '../config.js'
import { S_BAR, S_INFO, S_SUCCESS, message } from '../utils/clack.js'
import { getMigrator } from '../utils/getMigrator.js'

export async function list(config: Config) {
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
