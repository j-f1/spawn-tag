import { split } from 'shell-split'
import { SpawnOptions, ChildProcess } from 'child_process'

import crossSpawn = require('cross-spawn')
import pEvent = require('p-event')

export type TemplateTag<T> = (
  strings: TemplateStringsArray,
  ...interpolations: unknown[]
) => T

export interface Options extends SpawnOptions {
  capture?: {
    stdout?: BufferEncoding | boolean
    stderr?: BufferEncoding | boolean
  }
}

export interface Result {
  stdout: string | Buffer | null
  stderr: string | Buffer | null
  code: number
  signal: string | null
}

export interface PromiseLike extends Promise<Result> {
  childProcess: ChildProcess
}

function attachToStream(
  capture: Required<Options>['capture'],
  key: 'stdout' | 'stderr',
  result: Result,
  childProcess: ChildProcess,
) {
  const opt = capture[key]
  if (opt) {
    childProcess[key].on('data', (data: Buffer) => {
      const currentResult = result[key]
      if (typeof opt === 'string') {
        result[key] = currentResult + data.toString(opt)
      } else if (currentResult != null && currentResult instanceof Buffer) {
        result[key] = Buffer.concat([currentResult, data])
      } else {
        throw new Error(
          `Unexpected combination of encoding (${opt}) and data (${data})`,
        )
      }
    })
  }
}

export default function tag<T extends Options>(options: T) {
  const opts: T & Required<Pick<Options, 'capture'>> = Object.assign(
    { capture: { stdout: 'utf8', stderr: 'utf8' } },
    options,
  )

  const tag: TemplateTag<PromiseLike> = (strings, ...interpolations) => {
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

    const childProcess = crossSpawn(cmd, argv, opts)

    const result: Result = {
      stdout: opts.capture.stdout
        ? typeof opts.capture.stdout === 'string'
          ? ''
          : Buffer.alloc(0)
        : null,
      stderr: opts.capture.stderr
        ? typeof opts.capture.stderr === 'string'
          ? ''
          : Buffer.alloc(0)
        : null,
      code: null!, // Will be filled out when the process exits
      signal: null,
    }

    attachToStream(opts.capture, 'stdout', result, childProcess)
    attachToStream(opts.capture, 'stderr', result, childProcess)

    // will reject if an `error` event is emitted.
    const onClose = pEvent(childProcess, 'close', {
      multiArgs: true,
    })
    return Object.assign(
      onClose.then(([code, signal]) => {
        result.code = code
        result.signal = signal
        if (code || signal) {
          throw Object.assign(
            new Error(
              `Process exited with ${
                code ? `code ${code}` : `signal ${signal}`
              }.`,
            ),
            result,
          )
        }
        return result
      }),
      { childProcess },
    )
  }
  return tag
}
