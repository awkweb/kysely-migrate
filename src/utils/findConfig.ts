import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { findUp } from 'find-up'
import pc from 'picocolors'

// Do not reorder
// In order of preference files are checked
const configFiles = [
  'kysely-migrate.config.ts',
  'kysely-migrate.config.mts',
  'kysely.config.ts',
  'kysely.config.mts',
]

type FindConfigParameters = {
  config?: string | undefined
  root?: string | undefined
}

export async function findConfig<throwIfNotFound extends boolean>(
  parameters: FindConfigParameters,
  throwIfNotFound?: throwIfNotFound,
): Promise<throwIfNotFound extends true ? string : string | undefined> {
  const { config, root } = parameters
  const rootDir = resolve(root || process.cwd())
  if (config) {
    const path = resolve(rootDir, config)
    if (existsSync(path)) return path as any
    if (throwIfNotFound)
      throw new Error(`Config not found at ${pc.gray(config)}`)
  }

  const configPath = await findUp(configFiles, { cwd: rootDir })
  if (throwIfNotFound && !configPath) throw new Error('Config not found')

  return configPath as any
}
