import { basename, relative, resolve } from 'node:path'
import { cancel, confirm, intro, isCancel, outro } from '@clack/prompts'
import { writeFile } from 'fs/promises'
import pc from 'picocolors'

import { defaultConfig } from '../config.js'
import { findConfig } from '../utils/findConfig.js'

export type InitOptions = {
  config?: string | undefined
  root?: string | undefined
}

export async function init(options: InitOptions) {
  intro(pc.inverse(' kysely-migrate '))

  const rootDir = resolve(options.root || process.cwd())
  const outPath = resolve(rootDir, 'kysely-migrate.config.ts')

  const content = `import { defineConfig } from 'kysely-migrate'
      
export default defineConfig(${JSON.stringify(defaultConfig)})
`

  // Check for existing config file
  const configPath = await findConfig(options)
  let shouldContinue: boolean | symbol = true
  if (configPath && basename(configPath) === basename(outPath)) {
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
    outro(
      `Created config file at ${pc.green(relative(process.cwd(), outPath))}`,
    )
  } else outro('Config file not created.')

  return process.exit(0)
}
