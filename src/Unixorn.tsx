import React, { useState, useCallback, useRef, useEffect, useReducer } from 'react';
import { UnixornConfiguration, UnixornKernel, UnixornCommand, UnixornKeybinding } from '.';
import { defaultCommands } from './commands';
import { defaultKeybindings } from './keybindings';
import { historyReducer, HistoryItemType } from './reducers/history';
import { css, keyframes } from 'glamor';

const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [history, historyDispatch] = useReducer(historyReducer, []);
  const [inputPreCursor, setInputPreCursor] = useState('');
  const [inputPostCursor, setInputPostCursor] = useState('');
  const baseRef = useRef<null | HTMLDivElement>(null);
  const prompt = props.prompt || '> ';

  const commands = props.commands || defaultCommands;
  const commandMap: Map<string, UnixornCommand> =
    new Map(commands.map(command => [command.name, command]));

  const keybindings = props.keybindings || defaultKeybindings;
  const keybindingMap: Map<string, UnixornKeybinding> =
    new Map(keybindings.map(keybinding => [keybinding.key, keybinding]));

  const kernel: UnixornKernel = {
    moveCursorToEnd: () => {
      setInputPreCursor(inputPreCursor + inputPostCursor);
      setInputPostCursor('');
    },

    moveCursorToStart: () => {
      setInputPostCursor(inputPreCursor + inputPostCursor);
      setInputPreCursor('');
    },

    printErr: (text: string) => {
      historyDispatch({
        type: HistoryItemType.Error,
        content: text,
      });
    },

    printOut: (text: string) => {
      historyDispatch({
        type: HistoryItemType.Output,
        content: text,
      });
    },

    visit: (url: string) => {
      if (url.includes('://')) {
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
      case 'ArrowLeft':
        if (inputPreCursor.length > 0) {
          const lastChar = inputPreCursor.slice(-1);
          setInputPreCursor(inputPreCursor.slice(0, -1));
          setInputPostCursor(lastChar + inputPostCursor);
        }
        break;
      case 'ArrowRight':
        if (inputPostCursor.length > 0) {
          const firstChar = inputPostCursor[0];
          setInputPostCursor(inputPostCursor.substr(1));
          setInputPreCursor(inputPreCursor + firstChar);
        }
        break;
      case 'Backspace':
        setInputPreCursor(inputPreCursor.slice(0, -1));
        break;
      case 'Delete':
        setInputPostCursor(inputPostCursor.substr(1));
        break;
      case 'Enter':
        const fullLine = inputPreCursor + inputPostCursor;
        historyDispatch({
          type: HistoryItemType.Input,
          content: fullLine,
        });

        const tokens = fullLine.split(/\s+/).filter(token => token !== '');
        if (tokens.length > 0) {
          const commandName = tokens[0];
          const command = commandMap.get(commandName);
          if (command) {
            command.action(kernel, tokens);
          } else {
            historyDispatch({
              type: HistoryItemType.Error,
              content: `Unrecognized command: ${commandName}`,
            });
          }
        }

        setInputPreCursor('');
        setInputPostCursor('');
        break;
      default:
        if (e.key.length === 1) {
          if (!e.ctrlKey) {
            setInputPreCursor(inputPreCursor + e.key);
          }
          if (e.ctrlKey) {
            const keybinding = keybindingMap.get(e.key);
            if (keybinding) {
              keybinding.action(kernel);
            }
          }
        }
        break;
    }
  }, [inputPreCursor, inputPostCursor, history]);

  return (
    <div
      className={`${styles.base} unixorn-base`}
      onKeyDown={handleKeyDown}
      ref={baseRef}
      tabIndex={1}
    >
      {props.startupMessage && (
        <div>
          <span
            className={`${css(styles.text, styles.textOutput)} unixorn-startup-message`}
          >
            {props.startupMessage}
          </span>
        </div>
      )}
      {history.map((item, idx) => {
        switch (item.type) {
          case HistoryItemType.Input:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.prompt)} unixorn-prompt`}
                >
                  {prompt}
                </span>
                <span
                  className={`${css(styles.text, styles.textInput)} unixorn-input`}
                >
                  {item.content}
                </span>
              </div>
            );
          case HistoryItemType.Output:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.textOutput)} unixorn-output`}
                >
                  {item.content}
                </span>
              </div>
            );
          case HistoryItemType.Error:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.textError)} unixorn-error`}
                >
                  {item.content}
                </span>
              </div>
            );
        }
      })}
      <div>
        <span
          className={`${css(styles.text, styles.prompt)} unixorn-prompt unixorn-current`}
        >
          {prompt}
        </span>
        <span
          className={`${css(styles.text, styles.textInput)} unixorn-input unixorn-current`}
        >
          {inputPreCursor}
        </span>
        <span
          className={`${styles.cursor} unixorn-cursor`}
        >
          |
        </span>
        <span
          className={`${css(styles.text, styles.textInput)} unixorn-input unixorn-current`}
        >
          {inputPostCursor}
        </span>
      </div>
    </div>
  );
};

const animations = {
  blink: keyframes({
    '0%': { opacity: 1 },
    '50%': { opacity: 0 },
    '100%': { opacity: 1 },
  }),
};

const styles = {
  base: css({
    backgroundColor: 'black',
    height: '100%',
    overflowY: 'auto',
    width: '100%',
  }),
  cursor: css({
    animation: animations.blink,
    animationIterationCount: 'infinite',
    animationDuration: '1.5s',
    color: 'green',
  }),
  prompt: css({
    color: 'green',
  }),
  text: css({
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }),
  textInput: css({
    color: 'green',
  }),
  textOutput: css({
    color: 'white',
  }),
  textError: css({
    color: 'red',
  }),
};

export { Unixorn };
