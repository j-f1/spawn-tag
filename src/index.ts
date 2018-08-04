import { split } from 'shell-split'
import { spawn as cpSpawn, SpawnOptions } from 'child_process'

interface Options extends SpawnOptions {
  capture?: {
    stdout: boolean
    stderr: boolean
  }
}

const isStrings = (arg: any): arg is TemplateStringsArray =>
  arg && arg.length >= 1 && arg.raw && arg.raw.length >= 1

type TemplateTag<T> = (
  strings: TemplateStringsArray,
  ...interpolations: unknown[]
) => T

function spawn(options?: Options): TemplateTag<void>
function spawn(
  strings: TemplateStringsArray,
  ...interpolations: unknown[]
): void
function spawn(
  first: Options | null | undefined | TemplateStringsArray,
  ...rest: unknown[]
) {
  let options: Options = {}
  const tag: TemplateTag<void> = (strings, ...interpolations) => {
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

    return cpSpawn(
      cmd,
      argv,
      Object.assign({ capture: { stdout: true, stderr: true } }, options),
    )
  }

  if (isStrings(first)) {
    return tag(first, ...rest)
  }
  if (first != null) {
    options = first
  }
  return tag
}

type Spawn =
  | ((options: Options) => TemplateTag<void>)
  | ((...args: [TemplateStringsArray, ...unknown[]]) => void)

const spawnSilently: Spawn = (
  first: Options | TemplateStringsArray,
  ...rest: unknown[]
) => {
  const opts: Options = { capture: { stdout: false, stderr: false } }
  if (isStrings(first)) {
    return spawn(opts)(first, ...rest)
  }
  return spawn(Object.assign({}, opts, first))
}

Object.assign<Spawn, { silently: Spawn }>(spawn, {
  silently: spawnSilently,
})

export default spawn
export { spawnSilently, spawnSilently as silently }
