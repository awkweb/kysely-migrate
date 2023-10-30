import { relative } from 'path'
import { capitalCase } from 'change-case'
import { writeFile } from 'fs/promises'
import pc from 'picocolors'

import { S_BAR, S_SUCCESS, message, spinner } from '../utils/clack.js'
import { getEnums } from '../utils/codegen/getEnums.js'
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

  const s = spinner(config._spinnerMs)
  await s.start('Generating types')

  const tables = await db.introspection.getTables()
  const enums = await getEnums(db, config.codegen.dialect)

  const content = getTypes(
    tables,
    enums,
    config.codegen.dialect,
    config.codegen.definitions,
  )
  await writeFile(config.codegen.out, content)

  s.stop('Generated types')

  if (tables.length) process.stdout.write(`${pc.gray(S_BAR)}\n`)

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

  const codegenRelativeFilePath = relative(process.cwd(), config.codegen.out)
  return `Created ${pc.green(codegenRelativeFilePath)}`
}
