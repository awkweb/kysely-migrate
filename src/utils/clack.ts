import { type LogMessageOptions } from '@clack/prompts'
import isUnicodeSupported from 'is-unicode-supported'
import pc from 'picocolors'

// TODO: Import from Clack
const unicode = isUnicodeSupported()

function s(c: string, fallback: string) {
  if (unicode) return c
  return fallback
}

export const S_BAR = s('│', '|')
export const S_ERROR = s('■', 'x')
export const S_INFO = s('●', '•')
export const S_SUCCESS = s('◆', '*')

export function message(message = '', options: LogMessageOptions = {}) {
  const { symbol = pc.gray(S_BAR) } = options
  const parts = []
  if (message) {
    const [firstLine, ...lines] = message.split('\n')
    parts.push(
      `${symbol}  ${firstLine}`,
      ...lines.map((ln) => `${pc.gray(S_BAR)}  ${ln}`),
    )
  }
  process.stdout.write(`${parts.join('\n')}\n`)
}
