import { join } from 'node:path'
import { type ExecaSyncReturnValue, type SyncOptions } from 'execa'
import { execaCommandSync } from 'execa'
import pc from 'picocolors'
import { expect, test } from 'vitest'

import { version } from './version.js'

const cliPath = join(__dirname, '../src/cli.ts')

function run(args: string[], options: SyncOptions = {}): ExecaSyncReturnValue {
  return execaCommandSync(`bun ${cliPath} ${args.join(' ')}`, options)
}

test('--help', () => {
  const { stdout } = run(['--help'])
  expect(
    stdout
      .replace(version, 'x.y.z')
      .replace(pc.green('<project-directory>'), '<project-directory>'),
  ).toMatchInlineSnapshot(`
    "kysely-migrate/x.y.z

    Usage:
      $ kysely-migrate <command> [options]

    Commands:
      codegen  generate types from database metadata
      create   create new migration
      down     migrate one step down
      init     create configuration file
      list     list migrations
      to       migrate to selected migration
      up       migrate one step up

    For more info, run any command with the \`--help\` flag:
      $ kysely-migrate codegen --help
      $ kysely-migrate create --help
      $ kysely-migrate down --help
      $ kysely-migrate init --help
      $ kysely-migrate list --help
      $ kysely-migrate to --help
      $ kysely-migrate up --help

    Options:
      -c, --config <path>  Path to config file 
      -h, --help           Display this message 
      -r, --root <path>    Root path to resolve config from 
      -v, --version        Display version number "
  `)
})

test('--version', () => {
  const { stdout } = run(['--version'])
  expect(stdout).toContain(`kysely-migrate/${version} `)
})
