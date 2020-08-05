import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App, {configuration} from './App'
import { initUnixorn } from 'unixorn'

ReactDOM.render(<App />, document.getElementById('root'))

const defaultNonReactExampleDomNode = document.getElementById('default-non-react-example')
if (!defaultNonReactExampleDomNode) {
  throw new Error('Missing node.')
}
initUnixorn(defaultNonReactExampleDomNode)

const customNonReactExampleDomNode = document.getElementById('custom-non-react-example')
if (!customNonReactExampleDomNode) {
  throw new Error('Missing node.')
}
initUnixorn(customNonReactExampleDomNode, configuration)
