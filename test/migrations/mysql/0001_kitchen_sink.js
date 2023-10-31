import { sql } from 'kysely'

export async function up(db) {
  await db.schema
    .createTable('foo')
    /// behavior
    .addColumn('behavior_autoincrementing', 'integer', (col) =>
      col.autoIncrement().primaryKey(),
    )
    .addColumn('behavior_default_value', 'varchar(10)', (col) =>
      col.notNull().defaultTo('foo'),
    )
    .addColumn('behavior_nullable', 'varchar(200)', (col) => col)
    .addColumn('behavior_unwrap_column_type', 'decimal', (col) =>
      col.defaultTo(1).notNull(),
    )
    /// definitions
    .addColumn('field_bigint', 'bigint', (col) => col.notNull())
    .addColumn('field_binary', 'binary', (col) => col.notNull())
    .addColumn('field_bit', 'bit', (col) => col.notNull())
    .addColumn('field_blob', 'blob', (col) => col.notNull())
    .addColumn('field_char', 'char', (col) => col.notNull())
    .addColumn('field_date', 'date', (col) => col.notNull())
    .addColumn('field_datetime', 'datetime', (col) => col.notNull())
    .addColumn('field_decimal', 'decimal', (col) => col.notNull())
    .addColumn('field_double', 'double', (col) => col.notNull())
    .addColumn('field_enum', sql`enum('foo', 'bar', 'baz')`, (col) =>
      col.notNull(),
    )
    .addColumn('field_float', 'float', (col) => col.notNull())
    .addColumn('field_int', 'int', (col) => col.notNull())
    .addColumn('field_json', 'json', (col) => col.notNull())
    .addColumn('field_longblob', 'longblob', (col) => col.notNull())
    .addColumn('field_longtext', 'longtext', (col) => col.notNull())
    .addColumn('field_mediumblob', 'mediumblob', (col) => col.notNull())
    .addColumn('field_mediumint', 'mediumint', (col) => col.notNull())
    .addColumn('field_mediumtext', 'mediumtext', (col) => col.notNull())
    .addColumn('field_smallint', 'smallint', (col) => col.notNull())
    .addColumn('field_text', 'text', (col) => col.notNull())
    .addColumn('field_time', 'time', (col) => col.notNull())
    .addColumn('field_timestamp', 'timestamp', (col) => col.notNull())
    .addColumn('field_tinyblob', 'tinyblob', (col) => col.notNull())
    .addColumn('field_tinyint', 'tinyint', (col) => col.notNull())
    .addColumn('field_varbinary', 'varbinary(200)', (col) => col.notNull())
    .addColumn('field_varchar', 'varchar(200)', (col) => col.notNull())
    .addColumn('field_year', 'year', (col) => col.notNull())
    .execute()
}

export async function down(db) {
  await db.schema.dropTable('foo').ifExists().execute()
}
