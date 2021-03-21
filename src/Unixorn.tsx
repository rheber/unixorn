import React, {useState, useCallback} from 'react'
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornConfiguration } from './types';
import Tweenful, { percentage } from 'react-tweenful';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [history, setHistory] = useState<string[]>([]);
  const [inputPreCursor, setInputPreCursor] = useState("");
  const [inputPostCursor, setInputPostCursor] = useState("");
  const prompt = props.prompt || "> "

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    switch (e.key) {
      case "ArrowLeft":
        if (inputPreCursor.length > 0) {
          const lastChar = inputPreCursor.slice(-1);
          setInputPreCursor(inputPreCursor.slice(0, -1));
          setInputPostCursor(lastChar + inputPostCursor);
        }
        break;
      case "ArrowRight":
        if (inputPostCursor.length > 0) {
          const firstChar = inputPostCursor[0];
          setInputPostCursor(inputPostCursor.substr(1));
          setInputPreCursor(inputPreCursor + firstChar);
        }
        break;
      case "Backspace":
        setInputPreCursor(inputPreCursor.slice(0, -1));
        break;
      case "Delete":
        setInputPostCursor(inputPostCursor.substr(1));
        break;
      case "Enter":
        const newHistory = [...history];
        const fullLine = inputPreCursor + inputPostCursor;
        newHistory.push(fullLine);
        setHistory(newHistory);
        setInputPreCursor("");
        setInputPostCursor("");
        break;
      default:
        setInputPreCursor(inputPreCursor + e.key);
        break;
    }
  }, [inputPreCursor, inputPostCursor, history]);

  return (
    <div
      className={`${css(styles.base)} unixorn-base`}
      onKeyDown={handleKeyDown}
      tabIndex={1}
    >
      {history.map((item, idx) => {
        return (
          <div key={idx}>
            <span className={css(styles.text)}>{prompt + item}</span>
          </div>
        );
      })}
      <div>
        <span className={css(styles.text)}>{`${prompt}${inputPreCursor}`}</span>
        <Tweenful.span
          animate={percentage({
            '0%': {opacity: 1},
            '50%': {opacity: 0},
            '100%': {opacity: 1},
          })}
          className={css(styles.cursor)}
          duration={1500}
          easing="easeInOutCubic"
          loop={true}
        >|</Tweenful.span>
        <span className={css(styles.text)}>{inputPostCursor}</span>
      </div>
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
