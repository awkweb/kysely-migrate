import { Kysely, MysqlDialect, PostgresDialect } from 'kysely'
import { createPool } from 'mysql2'
import { Pool } from 'pg'

export const mysqlDb = new Kysely({
  dialect: new MysqlDialect({
    pool: createPool(
      `mysql://${process.env.database_username}:${process.env.database_password}@${process.env.database_host}/${process.env.database_name}`,
    ),
  }),
})

export const postgresDb = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: process.env.database_name,
      host: process.env.database_host,
      password: process.env.database_password,
      user: process.env.database_username,
    }),
  }),
})
