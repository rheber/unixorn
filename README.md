# README

## Purpose

Unixorn aspires to be a Unix-like environment with a shell interface that:

* can be embedded into a website

* comes with a set of built-in commands and keybindings

* can be extended with additional commands, keybindings and styles

You can view a [live example](https://rheber.github.io/unixorn/) of Unixorn in action.

## Installation

Execute `npm i unixorn`.

## Usage

### In React

```
import React, { Component } from 'react'

import Unixorn from 'unixorn'

const configuration = {}

class Example extends Component {
  render() {
    return <Unixorn {...configuration} />
  }
}
```

### Without React

```
import { initUnixorn } from 'unixorn'

const configuration = {}

const nonReactDomNode = document.getElementById('example')

initUnixorn(nonReactDomNode, configuration)
```

## Development

### To install dependencies

Execute `yarn install`.

### To build

Execute `yarn run build`.

### To run

Execute `yarn start`.

### To run the example app

Execute `yarn install` and `yarn start` in the example folder.

### To run the test suite and linter

Execute `yarn test`.

## Types

### UnixornCommand

|Name|Type|Description|
|-|-|-|
|action|(kernel: UnixornKernel, tokens: string[]) => void|The code of the command.
|name|string|The name of the command.|
|summary|string|A string summarising the purpose of the command.|
|usage|string|A string demonstrating how the command is used.|


### UnixornConfiguration

|Name|Type|Description|
|-|-|-|
|commands|UnixornCommand|Commands to use instead of the default commands.|
|startupMessage|string|The message to display when the terminal starts.|

### UnixornKernel

|Name|Type|Description|
|-|-|-|
|moveCursorToEnd |() => void|Move cursor to end of line.|
|moveCursorToStart |() => void|Move cursor to start of line.|
|printErr|(text: string) => void|Write text to stderr.|
|printOut|(text: string) => void|Write text to stdout.|
|visit|(url: string) => void|Visit a URL.|

## Similar Projects

* [Browsix](https://github.com/plasma-umass/browsix)

* [jq-console](https://github.com/replit-archive/jq-console)

* [OS.js](https://github.com/os-js/OS.js)

* [Terminal-In-React](https://github.com/nitin42/terminal-in-react)

* [terminal.js](https://github.com/eosterberg/terminaljs)

* [tty.js](https://github.com/chjj/tty.js)

* [xterm.js](https://github.com/xtermjs/xterm.js)
