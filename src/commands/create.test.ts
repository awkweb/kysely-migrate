import fs from 'fs-extra'
import { afterEach, beforeAll, expect, test } from 'vitest'

import { mysqlDb } from '../../test/config.js'
import { create } from './create.js'

const genPath = 'test/__app'

beforeAll(async () => await fs.ensureDir(genPath))

afterEach(() => fs.remove(genPath))

test('default', async () => {
  const migrationFolder = `${genPath}/create/migrations`
  await fs.ensureDir(migrationFolder)

  await create({ db: mysqlDb, migrationFolder }, { silent: true })

  const generatedFiles = (await fs.readdir(migrationFolder)).sort()
  expect(generatedFiles.length).toEqual(1)
})

test('name', async () => {
  const migrationFolder = `${genPath}/create/migrations`
  await fs.ensureDir(migrationFolder)

  await create(
    { db: mysqlDb, migrationFolder },
    {
      name: 'add user table',
      silent: true,
    },
  )

  const generatedFiles = (await fs.readdir(migrationFolder)).sort()
  expect(generatedFiles).toMatchInlineSnapshot(`
    [
      "0001_add_user_table.ts",
    ]
  `)
})
