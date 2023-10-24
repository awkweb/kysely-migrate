import { bundleRequire } from 'bundle-require'

import type { Config } from '../config.js'

type LoadConfigParameters = {
  configPath: string
}

export async function loadConfig(
  parameters: LoadConfigParameters,
): Promise<Config> {
  const { configPath } = parameters
  const res = await bundleRequire({ filepath: configPath })
  let config = res.mod.default
  if (config.default) config = config.default
  if (typeof config !== 'function') return config
  return await config()
}
