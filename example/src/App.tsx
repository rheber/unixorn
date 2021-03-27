import React from 'react'

import {
  defaultCommands,
  defaultKeybindings,
  Unixorn,
  UnixornConfiguration,
  UnixornCommand,
  UnixornKernel,
  UnixornKeybinding,
} from 'unixorn'

const customCommands: UnixornCommand[] = [
  {
    name: "wikipedia",
    usage: "wikipedia",
    summary: "Visit Wikipedia.",
    action: (kernel: UnixornKernel, _tokens: string[]) => {
      kernel.visit("en.wikipedia.org");
    },
  }
];

const customKeybindings: UnixornKeybinding[] = [
  {
    key: 'd',
    summary: 'Print a festive greeting.',
    action: (kernel: UnixornKernel) => {
      kernel.printOut("Merry New Year!");
    },
  }
]

const configuration: UnixornConfiguration = {
  commands: [...customCommands, ...defaultCommands],
  keybindings: [...customKeybindings, ...defaultKeybindings],
  prompt: ":) ",
  startupMessage: "Welcome to my shell!",
};

const App = () => {
  return (
    <div className="app">
      <h1>Unixorn</h1>

      <p>Unixorn is an extensible terminal for webpages. Consult the <a href="https://github.com/rheber/unixorn">Github page</a> for more information.</p>

      <div className="example">
        <p>You can use Unixorn out of the box...</p>
        <div className="unixorn-example">
          <Unixorn autoFocus />
        </div>
      </div>

      <div className="example">
        <p>...But it's designed to be easy to customize.</p>
        <div id="custom-example" className="unixorn-example">
        </div>
      </div>
    </div>
  );
}

export { configuration };
export default App;
