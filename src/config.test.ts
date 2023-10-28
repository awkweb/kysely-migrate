import { Kysely, MysqlDialect } from 'kysely'
import { createPool } from 'mysql2'
import { expect, test } from 'vitest'

import { defineConfig } from './config.js'

test('defineConfig', () => {
  expect(
    defineConfig({
      db: new Kysely({
        dialect: new MysqlDialect({ pool: createPool('mysql://') }),
      }),
      migrationFolder: 'src/db/migrations',
      codegen: {
        dialect: 'mysql',
        out: 'src/db/types.ts',
      },
    }),
  ).toBeDefined()
})
