import React, {useCallback, useEffect, useReducer, useState, useRef} from 'react';
import { UnixornConfiguration, UnixornKernel, UnixornCommand, UnixornKeybinding, defaultConfiguration } from './interfaces';
import { defaultCommands } from './commands';
import { defaultKeybindings } from './keybindings';
import { visualHistoryReducer, VisualHistoryItemType, commandHistoryReducer, VisualHistoryActionType } from './reducers/history';
import { css, keyframes } from 'glamor';
import { Defaultdict } from './utilities/defaultdict';

/**
 * The main component.
 */
const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [commandHistory, commandHistoryDispatch] = useReducer(commandHistoryReducer, []);
  const [commandHistoryPosition, setCommandHistoryPosition] = useState(-1);
  const [visualHistory, visualHistoryDispatch] = useReducer(visualHistoryReducer, []);
  const [inputPreCursor, setInputPreCursor] = useState('');
  const [inputPostCursor, setInputPostCursor] = useState('');
  const baseRef = useRef<null | HTMLDivElement>(null);
  const prompt = props.prompt || defaultConfiguration.prompt;

  // Determine message to display on load.
  useEffect(() => {
    if (props.startupMessage === '') {
      return;
    }
    const msg = props.startupMessage || defaultConfiguration.startupMessage;
    visualHistoryDispatch({
      type: VisualHistoryActionType.PushItem,
      item: {
        type: VisualHistoryItemType.StartupOutput,
        content: msg || '',
      },
    });
  }, [props.startupMessage]);

  // Construct command map to be loaded into kernel.
  const commands = props.commands || defaultCommands;
  const commandMap: Map<string, UnixornCommand> =
    new Map(commands.map(command => [command.name, command]));

  // Construct keybinding map to be loaded into kernel.
  // Looks a bit odd due to the nesting required for modfier keys.
  const keybindings = props.keybindings || defaultKeybindings;
  const keybindingMap:
    Defaultdict<Defaultdict<Defaultdict<UnixornKeybinding | null>>> = new Defaultdict(
      () => new Defaultdict(
        () => new Defaultdict(() => null),
      ),
    );
  keybindings.forEach(binding => {
    keybindingMap.
      get(binding.key).
      get(binding.ctrl.toString()).
      set(binding.meta.toString(), binding);
  });

  // Construct kernel.
  const kernel: UnixornKernel = {
    clearScreen: () => {
      visualHistoryDispatch({ type: VisualHistoryActionType.Clear });
    },

    commands: () => commands,

    deleteToEnd: () => {
      setInputPostCursor('');
    },

    deleteToStart: () => {
      setInputPreCursor('');
    },

    execute: (line: string) => {
      const tokens = line.split(/\s+/).filter(token => token !== '');
      if (tokens.length > 0) {
        const commandName = tokens[0];
        const command = commandMap.get(commandName);
        if (command) {
          command.action(kernel, tokens);
        } else {
          visualHistoryDispatch({
            type: VisualHistoryActionType.PushItem,
            item: {
              type: VisualHistoryItemType.Error,
              content: `Unrecognized command: ${commandName}`,
            }
          });
        }
      }
    },

    keybindings: () => keybindings,

    moveCursorToEnd: () => {
      setInputPreCursor(inputPreCursor + inputPostCursor);
      setInputPostCursor('');
    },

    moveCursorToStart: () => {
      setInputPostCursor(inputPreCursor + inputPostCursor);
      setInputPreCursor('');
    },

    printErr: (text: string) => {
      visualHistoryDispatch({
        type: VisualHistoryActionType.PushItem,
        item: {
          type: VisualHistoryItemType.Error,
          content: text,
        }
      });
    },

    printOut: (text: string) => {
      visualHistoryDispatch({
        type: VisualHistoryActionType.PushItem,
        item: {
          type: VisualHistoryItemType.Output,
          content: text,
        }
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

  // Potentially take focus.
  useEffect(() => {
    if (baseRef && baseRef.current && props.autoFocus) {
      baseRef.current.focus();
    }
  }, [props.autoFocus]);

  // Scroll to bottom when visual history updates.
  useEffect(() => {
    if (baseRef && baseRef.current) {
      baseRef.current.scrollTop = baseRef.current.scrollHeight;
    }
  }, [visualHistory]);

  // Handler for key presses.
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowDown':
        if (commandHistoryPosition > -1) {
          const newPosition = commandHistoryPosition - 1;
          if (newPosition === -1) {
            setInputPreCursor('');
            setInputPostCursor('');
          } else {
            const newCommand = commandHistory[newPosition];
            setInputPreCursor(newCommand.preCursor);
            setInputPostCursor(newCommand.postCursor);
          }
          setCommandHistoryPosition(newPosition);
        }
        break;
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
      case 'ArrowUp':
        if (commandHistoryPosition < commandHistory.length - 1) {
          const newPosition = commandHistoryPosition + 1;
          const newCommand = commandHistory[newPosition];
          setInputPreCursor(newCommand.preCursor);
          setInputPostCursor(newCommand.postCursor);
          setCommandHistoryPosition(newPosition);
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
        commandHistoryDispatch({
            preCursor: fullLine,
            postCursor: '',
        });
        visualHistoryDispatch({
          type: VisualHistoryActionType.PushItem,
          item: {
            type: VisualHistoryItemType.Input,
            content: fullLine,
          }
        });
        kernel.execute(fullLine);
        setInputPreCursor('');
        setInputPostCursor('');
        break;
      default:
        // For single keys, if modifiers are held then
        // consult the keybindings, else add it to the input.
        if (e.key.length === 1) {
          const keybinding = keybindingMap.
            get(e.key).
            get(e.ctrlKey.toString()).
            get(e.altKey.toString());

          if (keybinding) {
            keybinding.action(kernel);
          } else {
            setInputPreCursor(inputPreCursor + e.key);
          }
        }
        break;
    }
  }, [inputPreCursor, inputPostCursor, visualHistory]);

  return (
    <div
      className={`${styles.base} unixorn-base`}
      onKeyDown={handleKeyDown}
      ref={baseRef}
      tabIndex={1}
    >
      {visualHistory.map((item, idx) => {
        switch (item.type) {
          case VisualHistoryItemType.Input:
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
          case VisualHistoryItemType.Output:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.textOutput)} unixorn-output`}
                >
                  {item.content}
                </span>
              </div>
            );
          case VisualHistoryItemType.Error:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.textError)} unixorn-error`}
                >
                  {item.content}
                </span>
              </div>
            );
          case VisualHistoryItemType.StartupOutput:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.textOutput)} unixorn-startup-message`}
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
          className={`${styles.preContainer}`}
        >
          <span
            className={`${css(styles.text, styles.textInput)} unixorn-input unixorn-current`}
          >
            {inputPreCursor}
          </span>
          <span
            className={`${styles.cursor} unixorn-cursor`}
          />
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

const cursorStyle = css({
  display: 'none',
});

const styles = {
  base: css({
    backgroundColor: '#000000',
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    [`&:focus .${cursorStyle}`]: {
      animation: animations.blink,
      animationIterationCount: 'infinite',
      animationDuration: '1.5s',
      border: '#00FF00 1px solid',
      display: 'inline',
      height: '100%',
      position: 'absolute',
      right: 0,
    },
  }),
  cursor: cursorStyle,
  preContainer: css({
    position: 'relative',
  }),
  prompt: css({
    color: '#00FF00',
  }),
  text: css({
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  }),
  textInput: css({
    color: '#00FF00',
  }),
  textOutput: css({
    color: '#FFFFFF',
  }),
  textError: css({
    color: '#FF0000',
  }),
};

export { Unixorn, defaultConfiguration };
