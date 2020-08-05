import * as React from 'react'
import ReactDOM from 'react-dom'
import Terminal from 'terminal-in-react';
import { StyleSheet, css } from 'aphrodite-jss';

export interface UnixornConfiguration {
  startupMessage?: string;
}

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  return (
    <div className={css(styles.unixorn)}>
      <Terminal
        allowTabs={false}
        msg={props.startupMessage}
        hideTopBar
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

export { initUnixorn, Unixorn };
