import { NO_MIGRATIONS } from 'kysely'
import { expect, test } from 'vitest'

import { mysqlDb } from '../../test/config.js'
import { type Config } from '../config.js'
import { getMigrator } from '../utils/getMigrator.js'
import { up } from './up.js'

const config = {
  db: mysqlDb,
  migrationFolder: 'test/migrations/basic',
} satisfies Config

const migrator = getMigrator(config)

test('default', async () => {
  await migrator.migrateTo(NO_MIGRATIONS)

  await up(config, { silent: true })

  const tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(1)
  expect(tables).toMatchInlineSnapshot(`
    [
      {
        "columns": [
          {
            "dataType": "int",
            "hasDefaultValue": false,
            "isAutoIncrementing": true,
            "isNullable": false,
            "name": "id",
          },
          {
            "dataType": "timestamp",
            "hasDefaultValue": true,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "created_at",
          },
          {
            "dataType": "varchar",
            "hasDefaultValue": false,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "email",
          },
          {
            "dataType": "timestamp",
            "hasDefaultValue": true,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "updated_at",
          },
        ],
        "isView": false,
        "name": "user",
        "schema": "km",
      },
    ]
  `)

  await migrator.migrateTo(NO_MIGRATIONS)
})

test('latest', async () => {
  await migrator.migrateTo(NO_MIGRATIONS)

  await up(config, { latest: true, silent: true })
  const tables = await mysqlDb.introspection.getTables()
  expect(tables.length).toBe(2)
  expect(tables).toMatchInlineSnapshot(`
    [
      {
        "columns": [
          {
            "dataType": "int",
            "hasDefaultValue": false,
            "isAutoIncrementing": true,
            "isNullable": false,
            "name": "id",
          },
          {
            "dataType": "varchar",
            "hasDefaultValue": false,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "hash",
          },
          {
            "dataType": "int",
            "hasDefaultValue": false,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "user_id",
          },
        ],
        "isView": false,
        "name": "password",
        "schema": "km",
      },
      {
        "columns": [
          {
            "dataType": "int",
            "hasDefaultValue": false,
            "isAutoIncrementing": true,
            "isNullable": false,
            "name": "id",
          },
          {
            "dataType": "timestamp",
            "hasDefaultValue": true,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "created_at",
          },
          {
            "dataType": "varchar",
            "hasDefaultValue": false,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "email",
          },
          {
            "dataType": "timestamp",
            "hasDefaultValue": true,
            "isAutoIncrementing": false,
            "isNullable": false,
            "name": "updated_at",
          },
        ],
        "isView": false,
        "name": "user",
        "schema": "km",
      },
    ]
  `)

  await migrator.migrateTo(NO_MIGRATIONS)
})
