import { basename, relative, resolve } from 'node:path'
import { cancel, confirm, isCancel } from '@clack/prompts'
import { writeFile } from 'fs/promises'
import pc from 'picocolors'

import { type Config, defaultConfig } from '../config.js'
import { findConfig } from '../utils/findConfig.js'

export type InitOptions = {
  config?: string | undefined
  root?: string | undefined
  silent?: boolean | undefined
}

export async function init(_config: Config, options: InitOptions) {
  const rootDir = resolve(options.root || process.cwd())
  const outPath = resolve(rootDir, 'kysely-migrate.config.ts')

  const content = `import { defineConfig } from 'kysely-migrate'
      
export default defineConfig(${JSON.stringify(defaultConfig)})
`

  // Check for existing config file
  const configPath = await findConfig(options)
  let shouldContinue: boolean | symbol = true
  if (configPath && basename(configPath) === basename(outPath)) {
    if (options.silent) throw new Error('Config already exists.')

    shouldContinue = await confirm({
      message: `Overwrite config file at ${pc.gray(
        relative(process.cwd(), configPath),
      )}?`,
    })

    if (isCancel(shouldContinue)) {
      cancel('Operation cancelled')
      return process.exit(0)
    }
  }

  if (shouldContinue) {
    await writeFile(outPath, content)
    return `Created config file at ${pc.green(
      relative(process.cwd(), outPath),
    )}`
  }

  return 'Config file not created.'
}
