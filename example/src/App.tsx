import React from 'react'

import { Unixorn, UnixornConfiguration } from 'unixorn'

const configuration: UnixornConfiguration = {
  commands: [
    {
      name: "wikipedia",
      usage: "wikipedia",
      summary: "Visit Wikipedia.",
      action: (kernel, _params) => {
        kernel.visit("en.wikipedia.org");
      },
    }
  ],
  startupMessage: "Welcome to my shell!",
};

const App = () => {
  return (
    <div className="app">

      <div className="example">
        <h1>React example, default configuration</h1>
        <div className="unixorn-example">
          <Unixorn />
        </div>
      </div>

      <div className="example">
        <h1>Non-React example, default configuration</h1>
        <div id="default-non-react-example" className="unixorn-example">
        </div>
      </div>

      <div className="example">
        <h1>React example, custom configuration</h1>
        <div className="unixorn-example">
          <Unixorn {...configuration} />
        </div>
      </div>

      <div className="example">
        <h1>Non-React example, custom configuration</h1>
        <div id="custom-non-react-example" className="unixorn-example">
        </div>
      </div>
    </div>
  );
}

export { configuration };
export default App;
