import { expect, test } from 'vitest'

import { mysqlDb } from '../../test/config.js'
import { type Config } from '../config.js'
import { getMigrator } from '../utils/getMigrator.js'
import { down } from './down.js'

const config = {
  db: mysqlDb,
  migrationFolder: 'test/migrations/basic',
} satisfies Config

const migrator = getMigrator(config)

test('default', async () => {
  await migrator.migrateUp()

  let tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(1)

  await down(config, { silent: true })
  tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(0)
})

test('reset', async () => {
  await migrator.migrateToLatest()

  let tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(2)

  await down(config, { reset: true, silent: true })
  tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(0)
})
