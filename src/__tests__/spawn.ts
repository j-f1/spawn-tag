import spawn from '..'

import { join, relative } from 'path'

///<reference types="jest" />

const fixturePath = (...args: string[]) =>
  relative(process.cwd(), join(__dirname, 'fixtures', ...args))

describe('The `spawn` tag', () => {
  it('runs `echo` without errors', async () => {
    expect(await spawn`echo hello`).toMatchSnapshot()
  })

  it('handles interpolations with spaces properly', async () => {
    expect(await spawn`echo ${'Hello, world'}`).toMatchSnapshot()
  })

  it('converts non-string interpolations to strings', async () => {
    expect(await spawn`echo ${33}`).toMatchSnapshot()
  })

  it('escapes semicolons', async () => {
    expect(await spawn`echo ${'Hello!; echo Goodbye!'}`).toMatchSnapshot()
  })

  it('runs `ls` properly', async () => {
    expect(await spawn`ls ${fixturePath('dir')}`).toMatchSnapshot()
  })

  it('does not quote interpolated options', async () => {
    expect(await spawn`ls ${'-g'} ${fixturePath('dir')}`).toMatchSnapshot()
  })

  it('does ???', async () => {
    const promise = spawn`cat ${'- ' + fixturePath('file')}`
    promise.childProcess.stdin.end('hello')
    expect(
      promise.catch(arg => JSON.parse(JSON.stringify(arg))),
    ).resolves.toMatchSnapshot()
  })

  it('handles interpolations adjacent to literal text properly', async () => {
    expect(await spawn`echo abc${'def'}`).toMatchSnapshot()
  })

  it('handles `spawn` options correctly', async () => {
    expect(
      await spawn({
        env: { ...process.env, FOO: 'foo' },
      })`node -e 'console.log(process.env.FOO)'`,
    ).toMatchSnapshot()
  })
})

describe('The `spawn.silently` tag', () => {
  it('runs `echo` without errors', async () => {
    expect(await spawn.silently`echo hello`).toMatchSnapshot()
  })
})
