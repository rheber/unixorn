import * as React from 'react'
import ReactDOM from 'react-dom'
import Terminal from 'terminal-in-react';
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornCommand, UnixornConfiguration } from './types';
import { defaultCommands } from './commands';
import { unixornKernelImplementation } from './kernel';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const commands = props.commands || defaultCommands;

  const descriptions = Object.keys(commands).reduce((acc, key) => {
    const command: UnixornCommand = commands[key];
    return {
      ...acc,
      key: `${command.usage}: ${command.summary}`,
    };
  }, {});

  const actions = Object.keys(commands).reduce((acc, key) => {
    const command: UnixornCommand = commands[key];
    return {
      ...acc,
      key: (args: string[], _print: () => void, _runCmd: () => void) => {
        command.action(unixornKernelImplementation, args);
      },
    };
  }, {});

  return (
    <div className={css(styles.unixorn)}>
      <Terminal
        allowTabs={false}
        commands={actions}
        description={descriptions}
        hideTopBar
        msg={props.startupMessage}
      />
    </div>
  );
}

const styles = StyleSheet.create({
  unixorn: {
    height: "100%",
    width: "100%",
    "& .terminal-base": {
      height: "100%",
      width: "100%",
      maxHeight: "100%",
      maxWidth: "100%",
      minHeight: "100%",
      minWidth: "100%",
    },
    "& .terminal-base div div": {
      maxWidth: "100%",
      overflowX: "auto",
    },
  },
});

const initUnixorn = (
  element: HTMLElement,
  configuration?: UnixornConfiguration
) => {
  ReactDOM.render(<Unixorn {...configuration} />, element)
};

export {
  initUnixorn,
  Unixorn,
  UnixornCommand,
  UnixornConfiguration,
};
