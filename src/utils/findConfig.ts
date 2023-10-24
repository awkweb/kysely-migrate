import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { findUp } from 'find-up'

// Do not reorder
// In order of preference files are checked
const configFiles = ['kysely-migrate.config.ts', 'kysely-migrate.config.mts']

type FindConfigParameters = {
  config?: string | undefined
  root?: string | undefined
}

export async function findConfig(parameters: FindConfigParameters = {}) {
  const { config, root } = parameters
  const rootDir = resolve(root || process.cwd())
  if (config) {
    const path = resolve(rootDir, config)
    if (existsSync(path)) return path
    return
  }
  return findUp(configFiles, { cwd: rootDir })
}
