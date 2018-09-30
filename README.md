# spawn-tag

[![Build status](https://img.shields.io/travis/com/j-f1/spawn-tag.svg?style=flat-square)](https://travis-ci.com/j-f1/spawn-tag)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
TODO: Put more badges here.

> A template tag that safely runs commands for you

`spawn-tag` allows you to safely run terminal commands while including user
input. Instead of using escaping techniques, it uses Node.js’s `spawn` API to
pass arguments directly to the target command without using a shell to handle
parsing.

## Table of Contents

- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Security

Although the method used in this module should be secure, please email me
(address is in my profile) or contact me via Keybase (I’m `j_f`) if you find a
security issue. Please **do not open an issue** as this would reveal the
security issue I can implement and release a fix.

## Install

```sh
npm install spawn-tag
# or:
yarn add spawn-tag
```

## Usage

Import the library:

```ts
import spawn from 'spawn-tag'
// or:
import { spawn } from 'spawn-tag'
// or, if you’re using CommonJS still:
const { spawn } = require('spawn-tag')
```

```ts
const message = 'Hello, world!'
await spawn`echo ${message}`
// => { stdout: 'Hello, world!\n', stderr: '', code: 0, signal: null }
```

If you don’t need to keep the output, use `.silently` to avoid capturing it and
save memory.

```ts
await spawn.silently`rm -r node_modules`
// => { stdout: null, stderr: null, code: 0, signal: null }
```

If you want to customize encodings or other options passed to `spawn`, pass an
object:

```ts
await spawn({
  env: { ...process.env, MESSAGE: message },
})`node -e 'console.log(process.env.MESSAGE)'`
// => { stdout: 'Hello, world!\n', stderr: '', code: 0, signal: null }
```

> **Important**: Since `spawn-tag` does not use a shell, things like `$VAR` or
> `~` won’t resolve themselves.

`spawn` can also give you buffers for stdout/stderr:

```ts
await spawn({ capture: { stdout: true } })`echo ${message}`
// => { stdout: <Buffer 48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21 0a>, stderr: null, code: 0, signal: null }
```

The `Promise`-like object returned from `spawn` has a `childProcess` property
that contains the actual `ChildProcess` object if you need to interact with it.

## API

```ts
// Either of these will work:
import spawn, { spawn } from 'spawn-tag'

// Same with these:
import { spawnSilently, silently } from 'spawn-tag'
const { silently } = spawn

// if you use TypeScript
import { Options } from 'spawn-tag'
```

```ts
interface Result {
  // string by default or if you pass an encoding
  // Buffer if you pass `true`
  // null if you pass `false` or use `.silently`
  stdout: string | Buffer | null
  stderr: string | Buffer | null
  code: number
  signal: string | null
}

interface PromiseLike extends Promise<Result> {
  childProcess: ChildProcess
}

declare const silently:
  | TemplateTag<PromiseLike>
  | ((options: Options) => TemplateTag<PromiseLike>)

declare const spawn: { silently: typeof silently } & (
  | TemplateTag<PromiseLike>
  | ((options: Options) => TemplateTag<PromiseLike>))
```

## Maintainers

[@j-f1](https://github.com/j-f1)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Jed Fox
