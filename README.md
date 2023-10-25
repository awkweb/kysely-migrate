# kysely-migrate

[Kysely](https://github.com/kysely-org/kysely) migrations and codegen CLI

## Installation

```bash
npm i --save-dev kysely-migrate
pnpm add -D kysely-migrate
yarn add -D kysely-migrate
bun add -D kysely-migrate
```

## Usage

Create a `kysely-migrate.config.ts` file and fill it out:

```ts
// kysely-migrate.config.ts
import { Kysely, MysqlDialect } from 'kysely'
import { defineConfig } from 'kysely-migrate'
import { createPool } from 'mysql2'

export default defineConfig({
  db: new Kysely({
    dialect: new MysqlDialect({ pool: createPool('mysql://') }),
  }),
  migrationFolder: 'src/db/migrations',
  codegen: { dialect: 'mysql', out: 'src/db/types.ts' },
})
```

Run [commands](#commands) to manage migrations and generate types.

```bash
kysely-migrate <command> [options]
```

## API

### Commands

Run `kysely-migrate --help` or `kysely-migrate <command> --help` to see the list of available commands, options, and examples.

- `codegen` generate types from database metadata
- `create` create new migration
- `down` migrate one step down
- `init` create configuration file
- `list` list migrations
- `to` migrate to selected migration
- `up` migrate one step up

### defineConfig

Creates [`Config`](#config) object.

```ts
import { defineConfig } from 'kysely-migrate'
```

| Name    | Type                                       | Description                                                           |
| ------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `config` | `Config \| (() => Config \| Promise<Config>)` | Configuration object or a function that returns a configuration object. |
| returns | [`Config`](#config)                          | Configuration object.                                                  |

### loadEnv

Loads environment variables from `.env` or `.env.*` files.

```ts
import { loadEnv } from 'kysely-migrate'
```

| Name           | Type                      | Description                                 |
| -------------- | ------------------------- | ------------------------------------------- |
| `config.mode`   | `string \| undefined`      | `.env` file type (e.g. `` `.env.${mode}` ``) |
| `config.envDir` | `string \| undefined`      | Directory to load `.env` file from           |
| returns        | `Record<string, string>`  | Parsed environment variables.               |

### Config

`Config` object.

```ts
import { type Config } from 'kysely-migrate'
```

```ts
{
  /** Kysely instance used to manipulate migrations and introspect database */
  db: Kysely<any>
  /** Path to migrations directory */
  migrationFolder: string

  /** `kysely-migrate codegen` options */
  codegen?:
    | {
        /** Custom definition mappings for database types to TypeScript types */
        definitions?: Definitions | undefined
        /** Dialect definitions to inherit */
        dialect?: 'mysql' | 'postgres' | 'sqlite' | undefined
        /** Output file path */
        out: string
      }
    | undefined
  
  /** Used for internal `FileMigrationProvider` instance. Defaults to `node:fs/promises`. */
  fs?: FileMigrationProviderFS | undefined
  /** Used for internal `FileMigrationProvider` instance. Defaults to `node:path`. */
  path?: FileMigrationProviderPath | undefined
  /** Defaults to internal `migrator` created with `db` and `migrationFolder`. */
  migrator?: Migrator | undefined
}
```

### Dialect Definitions

Dialect definition files map database types to TypeScript types. They are used by the codegen command to generate types from database metadata. The following dialect definitions are available:

```ts
import {
  mysqlDefinitions,
  postgresDefinitions,
  sqliteDefinitions,
} from 'kysely-migrate'
```

## Contributing

Contributions to kysely-migrate are greatly appreciated! If you're interested in contributing, please create a [new GitHub Discussion](https://github.com/tmm/kysely-migrate/discussions/new?category=ideas) with some info on what you would like to work on **before submitting a pull request**.

## Sponsors

If you find kysely-migrate useful or use it for work, please consider supporting development on [GitHub Sponsors](https://github.com/sponsors/tmm). Thank you 🙏
