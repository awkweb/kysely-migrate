import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import { relative } from 'node:path'
import { intro, outro } from '@clack/prompts'
import { snakeCase } from 'change-case'
import { humanId } from 'human-id'
import pc from 'picocolors'

import { findConfig } from '../utils/findConfig.js'
import { loadConfig } from '../utils/loadConfig.js'

export type CreateOptions = {
  config?: string | undefined
  name?: string | undefined
  root?: string | undefined
}

export async function create(options: CreateOptions) {
  intro(pc.inverse(' kysely-migrate '))

  // Get cli config file
  const configPath = await findConfig(options)
  if (!configPath) {
    if (options.config)
      throw new Error(`Config not found at ${pc.gray(options.config)}`)
    throw new Error('Config not found')
  }

  const config = await loadConfig({ configPath })

  const migrationsDir = config.out
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await config.migrator.getMigrations()
  const migrationsCount = migrations.length

  const migrationNumber = (migrationsCount + 1).toString().padStart(4, '0')
  const migrationName = options.name
    ? snakeCase(options.name)
    : humanId({ separator: '_', capitalize: false })
  const migrationFileName = `${migrationNumber}_${migrationName}.ts`
  const migrationFilePath = `${migrationsDir}/${migrationFileName}`

  const content = `import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {}

export async function down(db: Kysely<any>): Promise<void> {}
`

  await writeFile(migrationFilePath, content)

  const migrationRelativeFilePath = relative(process.cwd(), migrationFilePath)
  outro(`Created ${pc.green(migrationRelativeFilePath)}`)
}
