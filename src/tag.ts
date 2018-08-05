import { split } from 'shell-split'
import { SpawnOptions } from 'child_process'
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

export default function tag<T extends Options>(options: T) {
  const opts: T & Required<Pick<Options, 'capture'>> = Object.assign(
    { capture: { stdout: false, stderr: false } },
    options,
  )
  type Result = {
    stdout: string | Buffer | null
    stderr: string | Buffer | null
  }

  const tag: TemplateTag<Promise<Result>> = (strings, ...interpolations) => {
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
      stdout:
        opts.capture.stdout != null
          ? typeof opts.capture.stdout === 'string'
            ? ''
            : Buffer.alloc(0)
          : null,
      stderr:
        opts.capture.stderr != null
          ? typeof opts.capture.stderr === 'string'
            ? ''
            : Buffer.alloc(0)
          : null,
    }

    if (opts.capture.stdout != null) {
      childProcess.stdout.on('data', (data: Buffer) => {
        if (typeof opts.capture.stdout === 'string') {
          result.stdout += data.toString(opts.capture.stdout)
        } else if (result.stdout instanceof Buffer) {
          result.stdout = Buffer.concat([result.stdout, data])
        }
      })
    }
    if (opts.capture.stderr != null) {
      childProcess.stderr.on('data', (data: Buffer) => {
        if (typeof opts.capture.stderr === 'string') {
          result.stderr += data.toString(opts.capture.stderr)
        } else if (result.stderr instanceof Buffer) {
          result.stderr = Buffer.concat([result.stderr, data])
        }
      })
    }

    const onExit = pEvent<[number, string]>(childProcess, 'exit', {
      multiArgs: true,
    })
    return Object.assign(
      onExit.then(arg => {
        const [code, signal] = arg
        if (code || signal) {
          throw Object.assign(
            new Error(
              `Process exited with ${
                code ? `code ${code}` : `signal ${signal}`
              }.`,
            ),
            { code, signal },
          )
        }
        return result
      }),
      { childProcess },
    )
  }
  return tag
}
