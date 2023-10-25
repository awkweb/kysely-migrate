import { Cli } from 'kysely-codegen'
import pc from 'picocolors'

import { relative } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { getTypes } from '../utils/codegen/getTypes.js'
import { findConfig } from '../utils/findConfig.js'
import { loadConfig } from '../utils/loadConfig.js'

export type CodegenOptions = {
  config?: string | undefined
  debug?: boolean | undefined
  root?: string | undefined
}

export async function codegen(options: CodegenOptions) {
  // Get cli config file
  const configPath = await findConfig(options, true)

  const config = await loadConfig({ configPath })

  const db = config.db
  if (!db) throw new Error('`db` config required to generate types.')

  const tables = await db.introspection.getTables()

  if (!config.codegen)
    throw new Error('`codegen` config required to generate types.')

  const content = getTypes(
    tables,
    config.codegen.dialect,
    config.codegen.definitions,
  )
  await writeFile(config.codegen.out, content)

  if (options.debug) {
    const cli = new Cli()
    const outFile = `${config.codegen.out}`.replace('.ts', '2.ts')
    await cli.generate({
      camelCase: false,
      dialectName: undefined,
      envFile: undefined,
      excludePattern: undefined,
      includePattern: undefined,
      logLevel: 0,
      outFile,
      print: false,
      schema: undefined,
      typeOnlyImports: true,
      url: `mysql://${process.env.database_username}:${
        process.env.database_password
      }@${process.env.database_host}/${process.env.database_name}${
        process.env.enable_psdb === 'true'
          ? '?ssl={"rejectUnauthorized":true}'
          : ''
      }`,
      verify: false,
    })
    const content2 = await readFile(outFile, 'utf-8')
    console.log(content)
    console.log(content2)
  }

  const codegenRelativeFilePath = relative(process.cwd(), config.codegen.out)
  return `Created ${pc.green(codegenRelativeFilePath)}`
}
