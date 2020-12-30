import React, {useState, useCallback} from 'react'
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornConfiguration } from './types';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [inputPreCursor, setInputPreCursor] = useState("");
  const [inputPostCursor] = useState("");
  const prompt = props.prompt || "> "

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      setInputPreCursor(inputPreCursor.slice(0, -1));
    }
    if (e.key.length === 1) {
      setInputPreCursor(inputPreCursor + e.key);
    }
  }, [inputPreCursor]);

  return (
    <div
      className={`${css(styles.base)} unixorn-base`}
      onKeyDown={handleKeyDown}
      tabIndex={1}
    >
      <span className={css(styles.text)}>{`${prompt}${inputPreCursor}`}</span>
      <span className={css(styles.cursor)}>|</span>
      <span className={css(styles.text)}>{inputPostCursor}</span>
    </div>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  },
  cursor: {
    color: "green",
  },
  text: {
    color: "green",
    fontFamily: "monospace",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  },
})

export { Unixorn };
