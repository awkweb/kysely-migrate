import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import { relative } from 'node:path'
import { snakeCase } from 'change-case'
import { humanId } from 'human-id'
import pc from 'picocolors'

import { findConfig } from '../utils/findConfig.js'
import { getMigrator } from '../utils/getMigrator.js'
import { loadConfig } from '../utils/loadConfig.js'

export type CreateOptions = {
  config?: string | undefined
  name?: string | undefined
  root?: string | undefined
}

export async function create(options: CreateOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })
  const migrator = getMigrator(config)

  const migrationsDir = config.migrationFolder
  if (!existsSync(migrationsDir)) await mkdir(migrationsDir)

  const migrations = await migrator.getMigrations()
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
  return `Created ${pc.green(migrationRelativeFilePath)}`
}
