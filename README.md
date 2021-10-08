# README

[![NPM](https://nodei.co/npm/unixorn.png?compact=true)](https://nodei.co/npm/unixorn/)

## Purpose

Unixorn aspires to be a Unix-like environment with a shell interface that:

* can be embedded into a website

* comes with a set of built-in commands and keybindings

* can be extended with additional commands, keybindings and styles

You can view a [live example](https://rheber.github.io/unixorn/example/index.html) of Unixorn in action.

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

## APIs

### Typescript Exports

Consult the [docs generated with typedoc](https://rheber.github.io/unixorn/docs/index.html).

### CSS Classes

The following classes may be targeted for styling:

  * unixorn-base
  * unixorn-current
  * unixorn-cursor
  * unixorn-error
  * unixorn-input
  * unixorn-output
  * unixorn-prompt
  * unixorn-startup-message

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

