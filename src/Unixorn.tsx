import React, {useState, useCallback} from 'react'
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornConfiguration } from './types';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = _props => {
  const [input, setInput] = useState("");

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key.length === 1) {
      setInput(input + e.key);
    }
  }, [input]);

  return (
    <div
      className={`${css(styles.base)} unixorn-base`}
      onKeyDown={handleKeyDown}
      tabIndex={1}
    >
      <p className={css(styles.text)}>{input}</p>
    </div>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  },
  text: {
    color: "green",
    fontFamily: "monospace",
  },
})

export { Unixorn };
