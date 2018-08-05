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

  function pEvent<T extends any[]>(
    emitter: pEvent.Emitter<T>,
    event: 'exit',
    options: { multiArgs: true },
  ): Promise<T>

  namespace pEvent {
    interface Emitter<T extends any[]> {
      on?: AddRmListenerFn<T>
      addListener?: AddRmListenerFn<T>
      addEventListener?: AddRmListenerFn<T>
      off?: AddRmListenerFn<T>
      removeListener?: AddRmListenerFn<T>
      removeEventListener?: AddRmListenerFn<T>
    }
  }

  type AddRmListenerFn<T extends any[]> = (
    event: 'exit',
    listener: (...args: T) => void,
  ) => void
}
