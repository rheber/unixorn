import * as React from 'react'
import Terminal from 'terminal-in-react';
import { StyleSheet, css } from 'aphrodite';

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
    /* display: "flex", */
    /* justifyContent: "center", */
    /* alignItems: "center", */
    height: "100%",
    width: "100%",
  }
});

export { Unixorn };
