import spawn from '..'

///<reference types="jest" />

describe('The `spawn` tag', () => {
  it('runs `ls` without errors', async () => {
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
  it('handles interpolations properly', async () => {
    expect(await spawn`echo ${'Hello, world'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "Hello, world
",
}
`)
    expect(await spawn`echo ${33}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "33
",
}
`)
    expect(await spawn`echo ${'Hello!; echo Goodbye!'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "Hello!; echo Goodbye!
",
}
`)
    expect(await spawn`echo ${'-e'} ${'a\\nb'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "-e a\\\\nb
",
}
`)
    expect(await spawn`echo ${'-e "a\\nb"'}`).toMatchInlineSnapshot(`
Object {
  "code": 0,
  "signal": null,
  "stderr": "",
  "stdout": "-e \\"a\\\\nb\\"
",
}
`)
  })
})

describe('The `spawn.silently` tag', () => {
  it('runs `ls` without errors', async () => {
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
