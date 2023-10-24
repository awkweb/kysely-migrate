import { outro } from '@clack/prompts'
import { type MigrationResult } from 'kysely'

export function logAppliedMigrationsCount(results: MigrationResult[]) {
  const appliedMigrations = results.filter(
    (result) => result.status === 'Success',
  )
  const appliedCount = appliedMigrations.length
  outro(
    `Applied ${appliedCount} ${
      appliedCount === 1 ? 'migration' : 'migrations'
    }.`,
  )
}
