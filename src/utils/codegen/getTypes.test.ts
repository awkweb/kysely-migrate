import {
  EmitHint,
  type PropertySignature,
  ScriptTarget,
  createPrinter,
  createSourceFile,
  factory,
} from 'typescript'
import { expect, test } from 'vitest'

import { mysqlDefinitions } from './definitions/mysql.js'
import { postgresDefinitions } from './definitions/postgres.js'
import { getColumnType, getTypes } from './getTypes.js'

function printPropertySignature(propertySignature: PropertySignature) {
  const node = factory.createTypeAliasDeclaration(
    undefined,
    factory.createIdentifier('Table'),
    undefined,
    factory.createTypeLiteralNode([propertySignature]),
  )
  const printer = createPrinter()
  return printer.printNode(
    EmitHint.Unspecified,
    node,
    createSourceFile('', '', ScriptTarget.Latest),
  )
}

test('getColumnType > Generated', () => {
  const res = getColumnType(
    {
      name: 'id',
      dataType: 'bigint',
      hasDefaultValue: false,
      isAutoIncrementing: true,
      isNullable: false,
    },
    {
      name: 'user',
      columns: [],
      isView: false,
    },
    new Map(),
    mysqlDefinitions,
    new Map(),
    new Set(),
  )
  expect(printPropertySignature(res)).toMatchInlineSnapshot(`
    "type Table = {
        id: Generated<number>;
    };"
  `)
})

test('getColumnType > Generated > UnwrapColumnType', () => {
  const res = getColumnType(
    {
      name: 'created_at',
      dataType: 'timestamp',
      hasDefaultValue: true,
      isAutoIncrementing: false,
      isNullable: false,
    },
    {
      name: 'user',
      columns: [],
      isView: false,
    },
    new Map(),
    postgresDefinitions,
    new Map(),
    new Set(),
  )
  expect(printPropertySignature(res)).toMatchInlineSnapshot(`
    "type Table = {
        created_at: Generated<UnwrapColumnType<ColumnType<Date, Date | string, Date | string>>>;
    };"
  `)
})

test('getColumnType > nullable', () => {
  const res = getColumnType(
    {
      name: 'foo',
      dataType: 'varchar',
      hasDefaultValue: false,
      isAutoIncrementing: false,
      isNullable: true,
    },
    {
      name: 'user',
      columns: [],
      isView: false,
    },
    new Map(),
    mysqlDefinitions,
    new Map(),
    new Set(),
  )
  expect(printPropertySignature(res)).toMatchInlineSnapshot(`
    "type Table = {
        foo: string | null;
    };"
  `)
})

test('getColumnType > unknown definition', () => {
  const res = getColumnType(
    {
      name: 'foo',
      dataType: 'bar',
      hasDefaultValue: false,
      isAutoIncrementing: false,
      isNullable: false,
    },
    {
      name: 'user',
      columns: [],
      isView: false,
    },
    new Map(),
    mysqlDefinitions,
    new Map(),
    new Set(),
  )
  expect(printPropertySignature(res)).toMatchInlineSnapshot(`
    "type Table = {
        foo: unknown;
    };"
  `)
})

test('getColumnType > Generated', () => {
  const res = getTypes(
    [
      {
        name: 'user',
        columns: [
          {
            name: 'id',
            dataType: 'bigint',
            hasDefaultValue: false,
            isAutoIncrementing: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            dataType: 'datetime',
            hasDefaultValue: true,
            isAutoIncrementing: false,
            isNullable: false,
          },
          {
            name: 'email',
            dataType: 'varchar',
            hasDefaultValue: false,
            isAutoIncrementing: false,
            isNullable: false,
          },
        ],
        isView: false,
      },
    ],
    new Map(),
    'mysql',
  )
  expect(res).toMatchInlineSnapshot(`
    "/** generated by kysely-migrate */
    import { type Generated, type Selectable, type Insertable, type Updateable } from \\"kysely\\";

    export type User = {
        id: Generated<number>;
        created_at: Generated<Date>;
        email: string;
    };

    export type UserSelectable = Selectable<User>;

    export type UserInsertable = Insertable<User>;

    export type UserUpdateable = Updateable<User>;

    export interface DB {
        user: User;
    }

    "
  `)
})
