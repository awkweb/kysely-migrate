import { intro, outro } from '@clack/prompts'
import pc from 'picocolors'

import { S_BAR, S_INFO, S_SUCCESS, message } from '../utils/clack.js'
import { findConfig } from '../utils/findConfig.js'
import { loadConfig } from '../utils/loadConfig.js'

export type ListOptions = {
  config?: string | undefined
  root?: string | undefined
}

export async function list(options: ListOptions) {
  intro(pc.inverse(' kysely-migrate '))

  // Get cli config file
  const configPath = await findConfig(options)
  if (!configPath) {
    if (options.config)
      throw new Error(`Config not found at ${pc.gray(options.config)}`)
    throw new Error('Config not found')
  }

  const config = await loadConfig({ configPath })

  const migrations = await config.migrator.getMigrations()
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

  outro(
    `Found ${migrationsCount} ${
      migrationsCount === 1 ? 'migration' : 'migrations'
    }.`,
  )

  return process.exit(0)
}
