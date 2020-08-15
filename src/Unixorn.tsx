import React from 'react'
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornConfiguration } from './types';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = _props => {
  return (
    <div
      className={`${css(styles.base)} unixorn-base`}
      onKeyDown={e => console.log(e)}
      tabIndex={1}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  },
})

export { Unixorn };
