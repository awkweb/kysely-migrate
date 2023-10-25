import { join } from 'node:path'
import { type ExecaSyncReturnValue, type SyncOptions } from 'execa'
import { execaCommandSync } from 'execa'
import fs from 'fs-extra'
import pc from 'picocolors'
import { afterEach, beforeAll, expect, test } from 'vitest'

import { version } from './version.js'

const cliPath = join(__dirname, '../src/cli.ts')

const projectName = 'test-app'
const genPath = join(__dirname, projectName)

function run(args: string[], options: SyncOptions = {}): ExecaSyncReturnValue {
  return execaCommandSync(`bun ${cliPath} ${args.join(' ')}`, options)
}

beforeAll(() => {
  fs.remove(genPath)
})

afterEach(() => fs.remove(genPath))

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
      -h, --help     Display this message 
      -v, --version  Display version number "
  `)
})

test('--version', () => {
  const { stdout } = run(['--version'])
  expect(stdout).toContain(`kysely-migrate/${version} `)
})

test('init', () => {
  fs.ensureDirSync(genPath)
  const { stdout } = run(['init'], { cwd: genPath })
  const generatedFiles = fs.readdirSync(genPath).sort()

  expect(stdout).toContain('Created config file at kysely-migrate.config.ts')
  expect(generatedFiles).toMatchInlineSnapshot(`
    [
      "kysely-migrate.config.ts",
    ]
  `)
})
