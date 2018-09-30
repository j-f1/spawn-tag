import tag, { TemplateTag, Options, PromiseLike } from './tag'

const isStrings = (arg: any): arg is TemplateStringsArray =>
  arg && arg.length >= 1 && arg.raw && arg.raw.length >= 1
const isOptions = (arg: any): arg is Options => !isStrings(arg)

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
  ): T extends Options ? TemplateTag<PromiseLike> : PromiseLike => {
    if (isOptions(first)) {
      return tag(first) as T extends Options
        ? TemplateTag<PromiseLike>
        : PromiseLike
    }
    const strings = first as TemplateStringsArray
    return tag({})(strings, ...rest) as T extends Options
      ? TemplateTag<PromiseLike>
      : PromiseLike
  },

  {
    silently: spawnSilently,
  },
)

export default spawn
export { spawn, spawnSilently, spawnSilently as silently, Options }
