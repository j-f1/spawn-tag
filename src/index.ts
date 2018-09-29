import tag, { TemplateTag, Options } from './tag'

const isStrings = (arg: any): arg is TemplateStringsArray =>
  arg && arg.length >= 1 && arg.raw && arg.raw.length >= 1

type Spawn =
  | ((options: Options) => TemplateTag<void>)
  | ((...args: [TemplateStringsArray, any[] | undefined]) => void)
const spawnSilently: Spawn = (
  first: Options | TemplateStringsArray,
  ...rest: unknown[]
) => {
  const opts: Options = { capture: { stdout: false, stderr: false } }
  if (isStrings(first)) {
    return tag(opts)(first, ...rest)
  }
  return tag(Object.assign({}, opts, first))
}

const spawn = Object.assign<Spawn, { silently: Spawn }>(
  (
    first: Options | null | undefined | TemplateStringsArray,
    ...rest: unknown[]
  ) => {
    if (isStrings(first)) {
      return tag({})(first, ...rest)
    }
    return tag(first || {})
  },

  {
    silently: spawnSilently,
  },
)

export default spawn
export { spawnSilently, spawnSilently as silently, Options }
