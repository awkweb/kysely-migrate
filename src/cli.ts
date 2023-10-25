#!/usr/bin/env node
import { intro, outro } from '@clack/prompts'
import { cac } from 'cac'
import pc from 'picocolors'

import { type CodegenOptions, codegen } from './commands/codegen.js'
import { type CreateOptions, create } from './commands/create.js'
import { type DownOptions, down } from './commands/down.js'
import { type InitOptions, init } from './commands/init.js'
import { type ListOptions, list } from './commands/list.js'
import { type ToOptions, to } from './commands/to.js'
import { type UpOptions, up } from './commands/up.js'
import { version } from './version.js'

const cli = cac('kysely-migrate')

cli
  .command('codegen', 'generate types from database metadata')
  .option('-c, --config <path>', '[string] path to config file')
  .option(
    '-d, --debug',
    '[boolean] debug generated types against kysely-codegen package',
  )
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} codegen`)
  .action(async (options: CodegenOptions) => await codegen(options))

cli
  .command('create', 'create new migration')
  .option('-n, --name <name>', '[string] migration name')
  .example((name) => `${name} create`)
  .action(async (options: CreateOptions) => await create(options))

cli
  .command('down', 'migrate one step down')
  .option('-c, --config <path>', '[string] path to config file')
  .option('-R, --reset', '[boolean] reset all migrations')
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} down`)
  .action(async (options: DownOptions) => await down(options))

cli
  .command('init', 'create configuration file')
  .option('-c, --config <path>', '[string] path to config file')
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} init`)
  .action(async (options: InitOptions) => await init(options))

cli
  .command('list', 'list migrations')
  .option('-c, --config <path>', '[string] path to config file')
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} list`)
  .action(async (options: ListOptions) => await list(options))

cli
  .command('to', 'migrate to selected migration')
  .option('-c, --config <path>', '[string] path to config file')
  .option('-n, --name <name>', '[string] migration name')
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} to`)
  .action(async (options: ToOptions) => await to(options))

cli
  .command('up', 'migrate one step up')
  .option('-c, --config <path>', '[string] path to config file')
  .option('-l, --latest', '[boolean] apply all pending migrations')
  .option('-r, --root <path>', '[string] root path to resolve config from')
  .example((name) => `${name} up`)
  .action(async (options: UpOptions) => await up(options))

cli.help()
cli.version(version)

try {
  // Parse CLI args without running command
  cli.parse(process.argv, { run: false })

  // If not matched command, either show help or error out
  if (!cli.matchedCommand) {
    if (cli.args.length === 0) {
      if (!cli.options.help && !cli.options.version) cli.outputHelp()
    } else {
      intro(pc.inverse(' kysely-migrate '))
      throw new Error(`Unknown command: ${cli.args.join(' ')}`)
    }
  } else intro(pc.inverse(' kysely-migrate '))

  const result = await cli.runMatchedCommand()
  if (result) outro(result)
  process.exit(0)
} catch (error) {
  outro(pc.red(`Error: ${(error as Error).message}`))
  process.exit(1)
}
