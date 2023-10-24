import type { MigrationResultSet } from 'kysely'
import pc from 'picocolors'

import { S_BAR, S_ERROR, S_INFO, S_SUCCESS, message } from './clack.js'

export async function logResultSet(resultSet: MigrationResultSet) {
  const { error, results = [] } = resultSet

  process.stdout.write(`${pc.gray(S_BAR)}\n`)

  let appliedCount = 0
  let usedError = false
  let index = 0
  for (const result of results) {
    index += 1
    const content = `${result.migrationName}.${result.direction.toLowerCase()}`
    switch (result.status) {
      case 'Success': {
        message(content, { symbol: pc.green(S_SUCCESS) })
        appliedCount += 1
        break
      }
      case 'Error': {
        if (!usedError) {
          message(`${content}\n${pc.gray((error as Error).message)}`, {
            symbol: pc.red(S_ERROR),
          })
          if (index !== results.length)
            process.stdout.write(`${pc.gray(S_BAR)}\n`)
          usedError = true
        } else message(content, { symbol: pc.red(S_ERROR) })
        break
      }
      case 'NotExecuted': {
        message(content, { symbol: pc.blue(S_INFO) })
        break
      }
    }
  }
}
