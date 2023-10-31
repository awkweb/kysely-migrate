#!/usr/bin/env node
import { intro, outro } from '@clack/prompts'
import { cac } from 'cac'
import pc from 'picocolors'

import { type CodegenOptions, codegen } from './commands/codegen.js'
import { type CreateOptions, create } from './commands/create.js'
import { type DownOptions, down } from './commands/down.js'
import { type InitOptions, init } from './commands/init.js'
import { list } from './commands/list.js'
import { type ToOptions, to } from './commands/to.js'
import { type UpOptions, up } from './commands/up.js'
import { findConfig } from './utils/findConfig.js'
import { loadConfig } from './utils/loadConfig.js'
import { version } from './version.js'

const cli = cac('kysely-migrate')

cli
  .option('-c, --config <path>', 'Path to config file')
  .help()
  .option('-r, --root <path>', 'Root path to resolve config from')
  .version(version)

cli
  .command('codegen', 'generate types from database metadata')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} codegen`)
  .action(async (options: CliOptions & CodegenOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return codegen(config, options)
  })

cli
  .command('create', 'create new migration')
  .option('-n, --name <name>', 'Migration name')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} create`)
  .example((name) => `${name} create --name="create_user_table"`)
  .action(async (options: CliOptions & CreateOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return create(config, options)
  })

cli
  .command('down', 'migrate one step down')
  .option('-R, --reset', 'Reset all migrations')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} down`)
  .example((name) => `${name} down --reset`)
  .action(async (options: CliOptions & DownOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return down(config, options)
  })

cli
  .command('init', 'create configuration file')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} init`)
  .example((name) => `${name} init --config kysely.config.ts`)
  .action(async (options: CliOptions & InitOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return init(config, options)
  })

cli
  .command('list', 'list migrations')
  .example((name) => `${name} list`)
  .action(async (options: CliOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return list(config)
  })

cli
  .command('to', 'migrate to selected migration')
  .option('-n, --name <name>', 'Migration name')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} to`)
  .example((name) => `${name} to --name 0001_every_mangos_carry`)
  .action(async (options: CliOptions & ToOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return to(config, options)
  })

cli
  .command('up', 'migrate one step up')
  .option('-l, --latest', 'Apply all pending migrations')
  .option('-s, --silent', 'Disable output')
  .example((name) => `${name} up`)
  .example((name) => `${name} up --latest`)
  .action(async (options: CliOptions & UpOptions) => {
    const configPath = await findConfig(options, true)
    const config = await loadConfig({ configPath })
    return up(config, options)
  })

type CliOptions = {
  config?: string | undefined
  root?: string | undefined
}

// Parse CLI args without running command
cli.parse(process.argv, { run: false })

if (cli.options.silent)
  try {
    await cli.runMatchedCommand()
    process.exit(0)
  } catch {
    process.exit(1)
  }
else
  try {
    // If not matched command, either show help or error out
    if (!cli.matchedCommand) {
      if (cli.args.length === 0) {
        if (!cli.options.help && !cli.options.version) cli.outputHelp()
      } else {
        intro(pc.inverse(' kysely-migrate '))
        throw new Error(`Unknown command: ${cli.args.join(' ')}`)
      }
    } else {
      intro(pc.inverse(' kysely-migrate '))
    }

    const result = await cli.runMatchedCommand()
    if (result) outro(result)
    process.exit(0)
  } catch (error) {
    outro(pc.red((error as Error).message))
    process.exit(1)
  }
