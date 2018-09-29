import tag, { Options } from './tag'

const isStrings = (arg: any): arg is TemplateStringsArray =>
  arg && arg.length >= 1 && arg.raw && arg.raw.length >= 1

const silent: Options = { capture: { stdout: false, stderr: false } }
const spawnSilently = <T extends Options | TemplateStringsArray>(
  first: T,
  ...rest: T extends Options ? [] : unknown[]
) => {
  if (isStrings(first)) {
    return tag(silent)(first, ...rest)
  }
  const opts = first as Options
  return tag(Object.assign({}, silent, opts))
}

let spawn = Object.assign(
  <T extends Options | TemplateStringsArray>(
    first: T,
    ...rest: T extends Options ? [] : unknown[]
  ) => {
    if (isStrings(first)) {
      return tag({})(first, ...rest)
    }
    const opts = first as Options
    return tag(opts)
  },

  {
    silently: spawnSilently,
  },
)

export default spawn
export { spawnSilently, spawnSilently as silently, Options }
