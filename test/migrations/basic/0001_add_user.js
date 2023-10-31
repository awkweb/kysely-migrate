import { sql } from 'kysely'

export async function up(db) {
  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('email', 'varchar(200)', (col) => col.notNull().unique())
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()
}

export async function down(db) {
  await db.schema.dropTable('user').ifExists().execute()
}
