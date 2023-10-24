import { type MigrationResult } from 'kysely'

export function getAppliedMigrationsCount(results: MigrationResult[]) {
  const appliedMigrations = results.filter(
    (result) => result.status === 'Success',
  )
  const appliedCount = appliedMigrations.length
  return `Applied ${appliedCount} ${
    appliedCount === 1 ? 'migration' : 'migrations'
  }.`
}
