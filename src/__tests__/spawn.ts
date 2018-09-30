import spawn from '..'

import { join, relative } from 'path'

///<reference types="jest" />

const fixturePath = (...args: string[]) =>
  relative(process.cwd(), join(__dirname, 'fixtures', ...args))

describe('The `spawn` tag', () => {
  it('runs `echo` without errors', async () => {
    expect(await spawn`echo hello`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "hello
",
}
`)
  })

  it('handles interpolations with spaces properly', async () => {
    expect(await spawn`echo ${'Hello, world'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "Hello, world
",
}
`)
  })

  it('converts non-string interpolations to strings', async () => {
    expect(await spawn`echo ${33}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "33
",
}
`)
  })

  it('escapes semicolons', async () => {
    expect(await spawn`echo ${'Hello!; echo Goodbye!'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "Hello!; echo Goodbye!
",
}
`)
  })

  it('runs `ls` properly', async () => {
    expect(await spawn`ls ${fixturePath('dir')}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "bar
foo
",
}
`)
  })

  it('does not quote interpolated options', async () => {
    expect(await spawn`ls ${'-g'} ${fixturePath('dir')}`)
      .toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "total 0
-rw-r--r--  1 staff  0 Sep 30 08:04 bar
-rw-r--r--  1 staff  0 Sep 30 08:04 foo
",
}
`)
  })

  it('does ???', async () => {
    const promise = spawn`cat ${'- ' + fixturePath('file')}`
    promise.childProcess.stdin.end('hello')
    expect(promise.catch(arg => JSON.parse(JSON.stringify(arg)))).resolves
      .toMatchInlineSnapshot(`
Object {
  "code": 1,
  "signal": null,
  "stderr": "cat: illegal option --  
usage: cat [-benstuv] [file ...]
",
  "stdout": "",
}
`)
  })

  it('handles interpolations adjacent to literal text properly', async () => {
    expect(await spawn`echo abc${'def'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "abcdef
",
}
`)
  })

  it('handles `spawn` options correctly', async () => {
    expect(
      await spawn({
        env: { ...process.env, FOO: 'foo' },
      })`node -e 'console.log(process.env.FOO)'`,
    ).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "foo
",
}
`)
  })
})

describe('The `spawn.silently` tag', () => {
  it('runs `echo` without errors', async () => {
    expect(await spawn.silently`echo hello`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": null,
  "stdout": null,
}
`)
  })
})
