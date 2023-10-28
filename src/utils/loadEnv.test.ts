import { expect, test } from 'vitest'

import { loadEnv } from './loadEnv.js'

test('loadEnv', () => {
  expect(loadEnv()).toMatchInlineSnapshot('{}')
})
