export async function up(db) {
  await db.schema
    .createTable('password')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('hash', 'varchar(200)', (col) => col.notNull())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addForeignKeyConstraint(
      'user_id',
      ['user_id'],
      'user',
      ['id'],
      (callback) => callback.onDelete('cascade'),
    )
    .execute()
}

export async function down(db) {
  await db.schema.dropTable('password').ifExists().execute()
}
