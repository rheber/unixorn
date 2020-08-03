import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initUnixorn } from 'unixorn'

ReactDOM.render(<App />, document.getElementById('root'))

const nonReactExampleDomNode = document.getElementById('non-react-example')
if (!nonReactExampleDomNode) {
  throw new Error('Missing node.')
}
initUnixorn(nonReactExampleDomNode)
