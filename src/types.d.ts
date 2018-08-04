declare module 'shell-split' {
  type Split = (str: string) => ReadonlyArray<string>

  type Quote =
    | ((str: string) => string)
    | ((str: ReadonlyArray<string>) => string)

  type ShellSplit = Split & {
    split: Split
    unquote: Split
    unescape: Split
    parse: Split

    quote: Quote
    join: Quote
    escape: Quote
    stringify: Quote
  }
  const split: ShellSplit

  export = split
}
