import { setTimeout as sleep } from 'node:timers/promises'
import { dirname, relative } from 'path'
import { capitalCase } from 'change-case'
import { writeFile } from 'fs/promises'
import { Cli } from 'kysely-codegen'
import pc from 'picocolors'

import { spinner } from '@clack/prompts'
import { S_BAR, S_SUCCESS, message } from '../utils/clack.js'
import { getTypes } from '../utils/codegen/getTypes.js'
import { findConfig } from '../utils/findConfig.js'
import { loadConfig } from '../utils/loadConfig.js'

export type CodegenOptions = {
  config?: string | undefined
  root?: string | undefined
}

export async function codegen(options: CodegenOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })

  const db = config.db
  if (!db) throw new Error('`db` config required to generate types.')

  if (!config.codegen)
    throw new Error('`codegen` config required to generate types.')

  const s = spinner()
  s.start('Generating types')
  await sleep(250) // so spinner has a chance :)

  const tables = await db.introspection.getTables()

  const content = getTypes(
    tables,
    config.codegen.dialect,
    config.codegen.definitions,
  )
  await writeFile(config.codegen.out, content)
  s.stop('Generated types')

  process.stdout.write(`${pc.gray(S_BAR)}\n`)

  for (const table of tables) {
    const count = table.columns.length
    const properties = pc.gray(
      pc.italic(`${count} ${count === 1 ? 'property' : 'properties'}`),
    )
    message(
      `${table.name} => ${pc.magenta('export')} ${pc.cyan('type')} ${pc.green(
        capitalCase(table.name),
      )} = ${pc.yellow('{')} ${properties} ${pc.yellow('}')}`,
      { symbol: pc.green(S_SUCCESS) },
    )
  }

  const kyselyCodegenOptions = config.codegen['kysely-codegen']
  if (kyselyCodegenOptions) {
    const defaultOptions = {
      camelCase: false,
      dialectName: config.codegen.dialect,
      envFile: undefined,
      excludePattern: undefined,
      includePattern: undefined,
      logLevel: 0,
      outFile: `${dirname(config.codegen.out)}/types-kc.ts`,
      print: false,
      schema: undefined,
      typeOnlyImports: true,
      verify: false,
    }
    const cliOptions =
      typeof kyselyCodegenOptions === 'object'
        ? { ...defaultOptions, ...kyselyCodegenOptions }
        : { ...defaultOptions, url: kyselyCodegenOptions }
    const cli = new Cli()
    await cli.generate(cliOptions)
  }

  const codegenRelativeFilePath = relative(process.cwd(), config.codegen.out)
  return `Created ${pc.green(codegenRelativeFilePath)}`
}
