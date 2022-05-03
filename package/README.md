# Grove

Universal AST parser built on Tree-sitter for [node](https://nodejs.org/en/)

![Version](https://img.shields.io/npm/v/@mintlify/grove) ![npm](https://img.shields.io/npm/dw/@mintlify/grove) ![License](https://img.shields.io/github/license/mintlify/grove) ![Stars](https://img.shields.io/github/stars/mintlify/grove?style=social)

```ts
import parser from '@mintlify/grove'

const code = 'print("Hello world")'
const languageId = 'python'

const parsed = parser(code, languageId) // get parsed AST
``` 

See the [interactive demo](https://grove.mintlify.com) for more information

## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install @mintlify/grove
```

In order to use Grove, you have the build from the [Rust](https://www.rust-lang.org/) dependency setup so it properly works for your operating system

```console
$ npm install cargo-cp-artifact --save-dev
```

```console
$ cd ./node_modules/@mintlify/grove/parser && npm run build
```

## Usage

Import the package

```ts
import parser from '@mintlify/grove'
```

Pass in the code and [language identifier](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers) as strings

```ts
const parsed = parser(code, languageId)
```

Currently Grove supports the following languages

| Language      | Identifier |
| ----------- | ----------- |
| JavaScript      | `javascript` |
| TypeScript   | `typescript` |
| Python | `python` |
| PHP | `php` |
| React JSX | `javascriptreact` |
| React TSX | `typescriptreact` |
| Ruby | `ruby` |
| Rust | `rust` |
| Java | `java` |
| Kotlin | `kotlin` |
| C | `c` |
| C++ | `cpp` |
| C# | `csharp` |
| Dart | `dart` |
| Go | `go` |

🚧 More languages are under construction and grows in accordance with Tree-sitter's [available parsers](https://tree-sitter.github.io/tree-sitter/)

## More Information

[Website](https://mintlify.com/)
[Twitter](https://twitter.com/mintlify)
[Discord](https://discord.gg/6W7GuYuxra)

_Built with 💚 by the Mintlify team_