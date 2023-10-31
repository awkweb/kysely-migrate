import { dirname, relative } from 'path'
import { capitalCase } from 'change-case'
import { writeFile } from 'fs/promises'
import pc from 'picocolors'

import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { type Config } from '../config.js'
import { S_BAR, S_SUCCESS, message, spinner } from '../utils/clack.js'
import { getEnums } from '../utils/codegen/getEnums.js'
import { getTypes } from '../utils/codegen/getTypes.js'

export type CodegenOptions = {
  silent?: boolean | undefined
}

export async function codegen(config: Config, options: CodegenOptions = {}) {
  if (!config.db) throw new Error('`db` config required to generate types.')
  if (!config.codegen)
    throw new Error('`codegen` config required to generate types.')

  const typesDir = dirname(config.codegen.out)
  if (!existsSync(typesDir)) await mkdir(typesDir)

  const s = spinner(config._spinnerMs, options.silent)
  await s.start('Generating types')

  const tables = await config.db.introspection.getTables()
  const enums = await getEnums(config.db, config.codegen.dialect)

  const content = getTypes(
    tables,
    enums,
    config.codegen.dialect,
    config.codegen.definitions,
  )
  await writeFile(config.codegen.out, content)

  s.stop('Generated types')

  if (options.silent) return

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
