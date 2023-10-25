# kysely-migrate

[Kysely](https://github.com/kysely-org/kysely) migrations and codegen CLI

## Installation

```bash
npm i --save-dev kysely-migrate
```

## Usage

```bash
kysely-migrate <command> [options]
```

## Docs

Run `kysely-migrate --help` (output below) or `kysely-migrate <command> --help` to see the list of available commands and options.

```bash
Usage:
  $ kysely-migrate <command> [options]

Commands:
  codegen  generate types from database metadata
  create   create new migration
  down     migrate one step down
  init     create configuration file
  list     list migrations
  to       migrate to selected migration
  up       migrate one step up

For more info, run any command with the `--help` flag:
  $ kysely-migrate create --help

Options:
  -h, --help     Display this message 
  -v, --version  Display version number 
```

## Sponsors

If you find kysely-migrate useful or use it for work, please consider supporting development on [GitHub Sponsors](https://github.com/sponsors/tmm). Thank you 🙏
