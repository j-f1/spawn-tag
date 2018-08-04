import { split } from 'shell-split'
import { spawn as cpSpawn, SpawnOptions } from 'child_process'

import thenable from './thenable'

export type TemplateTag<T> = (
  strings: TemplateStringsArray,
  ...interpolations: unknown[]
) => T

export interface Options extends SpawnOptions {
  capture?: {
    stdout: boolean
    stderr: boolean
  }
}

export default function tag(opts: Options): TemplateTag<void> {
  return (strings, ...interpolations) => {
    let sep = '%expr%'
    while (strings.find(str => str.includes(sep))) {
      sep += '%'
    }
    const args = [...split(strings.join(sep))]
    let i = 0
    for (let idx = 0; idx < args.length; idx++) {
      while (args[idx].includes(sep)) {
        args[idx] = args[idx].replace(sep, () => String(interpolations[i++]))
      }
    }

    const [cmd, ...argv] = args

    const child = cpSpawn(cmd, argv, opts)
    return thenable(child)
  }
}
