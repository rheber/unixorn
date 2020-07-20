import * as React from 'react'
import Terminal from 'terminal-in-react';
import { StyleSheet, css } from 'aphrodite-jss';

const Unixorn: React.FunctionComponent = () => {
  return (
    <div className={css(styles.unixorn)}>
      <Terminal
        allowTabs={false}
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

export { Unixorn };
