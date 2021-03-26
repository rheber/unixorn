import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App, {configuration} from './App'
import { initUnixorn } from 'unixorn'

ReactDOM.render(<App />, document.getElementById('root'))

const customExampleDomNode = document.getElementById('custom-example')
if (!customExampleDomNode) {
  throw new Error('Missing node.')
}
initUnixorn(customExampleDomNode, configuration)
