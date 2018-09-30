import spawn, { Options } from '..'

import { TemplateTag } from '../tag'

import { join, relative } from 'path'

///<reference types="jest" />

const fixturePath = (...args: string[]) =>
  relative(process.cwd(), join(__dirname, 'fixtures', ...args))

const t = (name: string, opts?: Options): TemplateTag<void> => (
  strings,
  ...args
) => {
  it(name, async () => {
    const callee = opts ? spawn(opts) : spawn
    expect(await callee(strings, ...args)).toMatchSnapshot()
  })
}

describe('The `spawn` tag', () => {
  t('runs `echo` without errors')`echo hello`

  t('handles interpolations with spaces properly')`echo ${'Hello, world'}`

  t('converts non-string interpolations to strings')`echo ${33}`

  t('escapes semicolons')`echo ${'Hello!; echo Goodbye!'}`

  t('runs `ls` properly')`ls ${fixturePath('dir')}`

  t('does not quote interpolated options')`ls ${'-g'} ${fixturePath('dir')}`

  it('passes space-delimited text as one option', async () => {
    const promise = spawn`cat ${'- ' + fixturePath('file')}`
    promise.childProcess.stdin.end('hello')
    expect(
      await promise.catch(arg => JSON.parse(JSON.stringify(arg))),
    ).toMatchSnapshot()
  })

  t(
    'handles interpolations adjacent to literal text properly',
  )`echo abc${'def'}`

  t('handles `spawn` options correctly', {
    env: { ...process.env, FOO: 'foo' },
  })`node -e 'console.log(process.env.FOO)'`
})

describe('The `spawn.silently` tag', () => {
  it('runs `echo` without errors', async () => {
    expect(await spawn.silently`echo hello`).toMatchSnapshot()
  })
})
