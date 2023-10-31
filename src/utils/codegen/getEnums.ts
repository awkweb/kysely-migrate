import type { Kysely } from 'kysely'
import type { Dialect } from './types.js'

const mysqlEnumRegex = /^enum\((?:(?<values>'.*'),?)+\)$/

export async function getEnums(db: Kysely<any>, dialect: Dialect | undefined) {
  const enums = new Map<string, string[]>()
  if (dialect === 'mysql') {
    const results = await db
      .withoutPlugins()
      .selectFrom('information_schema.COLUMNS')
      .select(['COLUMN_NAME', 'COLUMN_TYPE', 'TABLE_NAME', 'TABLE_SCHEMA'])
      .execute()
      .catch(() => [])

    for (const result of results) {
      const key = `${result.TABLE_SCHEMA}.${result.TABLE_NAME}.${result.COLUMN_NAME}`
      if (mysqlEnumRegex.test(result.COLUMN_TYPE)) {
        const match = mysqlEnumRegex.exec(result.COLUMN_TYPE)
        const enumValues = match?.groups?.values?.replace(/'/g, '')?.split(',')
        if (enumValues?.length) enums.set(key, enumValues)
      }
    }
  } else if (dialect === 'postgres') {
    const results = await db
      .withoutPlugins()
      .selectFrom('pg_type as type')
      .innerJoin('pg_enum as enum', 'type.oid', 'enum.enumtypid')
      .innerJoin(
        'pg_catalog.pg_namespace as namespace',
        'namespace.oid',
        'type.typnamespace',
      )
      .select(['namespace.nspname', 'type.typname', 'enum.enumlabel'])
      .execute()
      .catch(() => [])

    for (const result of results) {
      const key = `${result.nspname}.${result.typname}`
      if (enums.has(key))
        enums.set(key, [...enums.get(key)!.values(), result.enumlabel])
      else enums.set(key, [result.enumlabel])
    }
  }

  return enums
}
