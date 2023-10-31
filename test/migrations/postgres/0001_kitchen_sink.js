import { sql } from 'kysely'

export async function up(db) {
  await db.schema.createType('my_enum').asEnum(['foo', 'bar', 'baz']).execute()

  await db.schema
    .createTable('foo')
    /// behavior
    .addColumn('behavior_autoincrementing', 'serial', (col) => col.primaryKey())
    .addColumn('behavior_default_value', 'text', (col) =>
      col.notNull().defaultTo('foo'),
    )
    .addColumn('behavior_nullable', 'varchar(200)', (col) => col)
    .addColumn('behavior_unwrap_column_type', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    /// definitions
    .addColumn('field_bit', 'bit', (col) => col.notNull())
    .addColumn('field_bool', 'bool', (col) => col.notNull())
    .addColumn('field_box', 'box', (col) => col.notNull())
    .addColumn('field_bpchar', 'bpchar', (col) => col.notNull())
    .addColumn('field_bytea', 'bytea', (col) => col.notNull())
    .addColumn('field_cidr', 'cidr', (col) => col.notNull())
    .addColumn('field_date', 'date', (col) => col.notNull())
    .addColumn('field_enum', 'my_enum', (col) => col.notNull())
    .addColumn('field_float4', 'float4', (col) => col.notNull())
    .addColumn('field_float8', 'float8', (col) => col.notNull())
    .addColumn('field_inet', 'inet', (col) => col.notNull())
    .addColumn('field_int2', 'int2', (col) => col.notNull())
    .addColumn('field_int4', 'int4', (col) => col.notNull())
    .addColumn('field_int8', 'int8', (col) => col.notNull())
    .addColumn('field_json', 'json', (col) => col.notNull())
    .addColumn('field_jsonb', 'jsonb', (col) => col.notNull())
    .addColumn('field_line', 'line', (col) => col.notNull())
    .addColumn('field_lseg', 'lseg', (col) => col.notNull())
    .addColumn('field_macaddr', 'macaddr', (col) => col.notNull())
    .addColumn('field_money', 'money', (col) => col.notNull())
    .addColumn('field_numeric', 'numeric', (col) => col.notNull())
    .addColumn('field_oid', 'oid', (col) => col.notNull())
    .addColumn('field_path', 'path', (col) => col.notNull())
    .addColumn('field_polygon', 'polygon', (col) => col.notNull())
    .addColumn('field_serial', 'serial', (col) => col.notNull())
    .addColumn('field_text', 'text', (col) => col.notNull())
    .addColumn('field_time', 'time', (col) => col.notNull())
    .addColumn('field_timestamp', 'timestamp', (col) => col.notNull())
    .addColumn('field_timestamptz', 'timestamptz', (col) => col.notNull())
    .addColumn('field_tsquery', 'tsquery', (col) => col.notNull())
    .addColumn('field_tsvector', 'tsvector', (col) => col.notNull())
    .addColumn('field_txid_snapshot', 'txid_snapshot', (col) => col.notNull())
    .addColumn('field_uuid', 'uuid', (col) => col.notNull())
    .addColumn('field_varbit', 'varbit', (col) => col.notNull())
    .addColumn('field_varchar', 'varchar', (col) => col.notNull())
    .addColumn('field_xml', 'xml', (col) => col.notNull())
    .execute()
}

export async function down(db) {
  await db.schema.dropTable('foo').ifExists().execute()
  await db.schema.dropType('my_enum').ifExists().execute()
}
