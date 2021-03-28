# README

## Purpose

Unixorn aspires to be a Unix-like environment with a shell interface that:

* can be embedded into a website

* comes with a set of built-in commands and keybindings

* can be extended with additional commands, keybindings and styles

You can view a [live example](https://rheber.github.io/unixorn/) of Unixorn in action.

[Full documentation](https://htmlpreview.github.io/?https://github.com/rheber/unixorn/blob/master/docs/index.html) is generated with typedoc.

## Installation

Execute `yarn add unixorn`.

## Basic Usage

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

### To regenerate docs

Execute `yarn docs`.

### To run the example app

Execute `yarn install` and `yarn start` in the example folder.

### To run the test suite and linter

Execute `yarn test`.

