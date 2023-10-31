import fs from 'fs-extra'
import { afterEach, beforeAll, expect, test } from 'vitest'

import { mysqlDb } from '../../test/config.js'
import { init } from './init.js'

const genPath = 'test/__app'

beforeAll(async () => await fs.ensureDir(genPath))

afterEach(() => fs.remove(genPath))

test('default', async () => {
  await init(
    {
      db: mysqlDb,
      migrationFolder: `${genPath}/migrations`,
    },
    { root: genPath, silent: true },
  )

  const generatedFiles = (await fs.readdir(genPath)).sort()
  expect(generatedFiles).toMatchInlineSnapshot(`
    [
      "kysely-migrate.config.ts",
    ]
  `)
})
