import React, {useState, useCallback, useRef, useEffect} from 'react'
import { StyleSheet, css } from 'aphrodite-jss';
import { UnixornConfiguration, UnixornKernel } from './types';
import Tweenful, { percentage } from 'react-tweenful';

enum HistoryItemType {
  Input,
  Output,
  Error,
}

interface HistoryItem {
  type: HistoryItemType;
  content: string;
}

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputPreCursor, setInputPreCursor] = useState("");
  const [inputPostCursor, setInputPostCursor] = useState("");
  const baseRef = useRef<null | HTMLDivElement>(null);
  const prompt = props.prompt || "> "

  const kernel: UnixornKernel = {
    moveCursorToEnd: () => {
      setInputPreCursor(inputPreCursor + inputPostCursor);
      setInputPostCursor("");
    },

    moveCursorToStart: () => {
      setInputPostCursor(inputPreCursor + inputPostCursor);
      setInputPreCursor("");
    },

    printErr: (text: string) => console.error(text),

    printOut: (text: string) => console.info(text),

    visit: (url: string) => {
      if(url.includes('://')) {
        window.open(url);
        return;
      }
      window.open(`https://${url}`);
    },
  };

  useEffect(() => {
    if (baseRef && baseRef.current) {
      baseRef.current.scrollTop = baseRef.current.scrollHeight;
    }
  }, [history]);

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
        newHistory.push({
          type: HistoryItemType.Input,
          content: fullLine,
        });
        setHistory(newHistory);
        setInputPreCursor("");
        setInputPostCursor("");
        break;
      default:
        if (e.key.length === 1) {
          if (!e.ctrlKey) {
            setInputPreCursor(inputPreCursor + e.key);
          }
          if (e.ctrlKey) {
            switch (e.key) {
              case 'a':
              case 'A':
                kernel.moveCursorToStart();
                break;
              case 'e':
              case 'E':
                kernel.moveCursorToEnd();
                break;
            }
          }
        }
        break;
    }
  }, [inputPreCursor, inputPostCursor, history]);

  return (
    <div
      className={`${css(styles.base)} unixorn-base`}
      onKeyDown={handleKeyDown}
      ref={baseRef}
      tabIndex={1}
    >
      {props.startupMessage && (
        <div>
          <span className={css(styles.text)}>{props.startupMessage}</span>
        </div>
      )}
      {history.map((item, idx) => {
        return (
          <div key={idx}>
            <span className={css(styles.text)}>{prompt + item.content}</span>
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
    overflowY: "auto",
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
