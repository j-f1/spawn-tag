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

declare module 'p-event' {
  // Type definitions for p-event 1.3
  // Made specific to my use-case.
  // Project: https://github.com/sindresorhus/p-event#readme
  // Definitions by: BendingBender <https://github.com/BendingBender>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 2.3

  export = pEvent

  function pEvent(
    emitter: pEvent.Emitter,
    event: 'close',
    options: { multiArgs: true },
  ): Promise<[number, string]>

  namespace pEvent {
    interface Emitter {
      on?: AddRmListenerFn
      addListener?: AddRmListenerFn
      addEventListener?: AddRmListenerFn
      off?: AddRmListenerFn
      removeListener?: AddRmListenerFn
      removeEventListener?: AddRmListenerFn
    }
  }

  type AddRmListenerFn = (
    event: 'close',
    listener: (code: number, signal: string) => void,
  ) => void
}
