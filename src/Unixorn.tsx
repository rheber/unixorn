import React, { useCallback, useEffect, useReducer, useState, useRef, useMemo } from 'react';
import { UnixornConfiguration, UnixornKernel, UnixornCommand, UnixornKeybinding, defaultConfiguration } from './interfaces';
import { defaultCommands } from './commands';
import { defaultKeybindings } from './keybindings';
import { visualHistoryReducer, VisualHistoryItemType, commandHistoryReducer, VisualHistoryActionType } from './reducers/history';
import { css } from 'glamor';
import { Defaultdict } from './utilities/defaultdict';

/**
 * The main component.
 */
const Unixorn: React.FunctionComponent<UnixornConfiguration> = props => {
  const [commandHistory, commandHistoryDispatch] = useReducer(commandHistoryReducer, []);
  const [commandHistoryPosition, setCommandHistoryPosition] = useState(-1);
  const [visualHistory, visualHistoryDispatch] = useReducer(visualHistoryReducer, []);
  const baseRef = useRef<null | HTMLDivElement>(null);
  const prompt = props.prompt || defaultConfiguration.prompt;
  const [inputValue, setInputValue] = useState('');
  const inputRender = useMemo(() => { return inputValue; }, [inputValue]);
  const inputRef = useRef<null | HTMLInputElement>(null);

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
        prompt: props.prompt || defaultConfiguration.prompt,
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
      const caret: any = inputRef.current?.selectionStart;
      setInputValue(inputValue.slice(0, caret));
    },

    deleteToStart: () => {
      const caret: any = inputRef.current?.selectionStart;
      setInputValue(inputValue.slice(caret, inputValue.length));
      inputRef.current?.setSelectionRange(0, 0);
    },

    execute: (stmt: string[]) => {
      if (stmt.length > 0) {
        const commandName = stmt[0];
        const command = commandMap.get(commandName);
        if (command) {
          command.action(kernel, stmt);
        } else {
          visualHistoryDispatch({
            type: VisualHistoryActionType.PushItem,
            item: {
              type: VisualHistoryItemType.Error,
              content: `Unrecognized command: ${commandName}`,
              prompt: props.prompt || defaultConfiguration.prompt,
            },
          });
        }
      }
    },

    keybindings: () => keybindings,

    moveCursorToEnd: () => {
      const inputLength = inputValue.length;
      inputRef.current?.setSelectionRange(inputLength, inputLength);
    },

    moveCursorToStart: () => {
      inputRef.current?.setSelectionRange(0, 0);
    },

    parse: (tokens: string[]) => {
      const stmts = [];
      let i = 0;
      const tokenAmt = tokens.length;
      while (i < tokenAmt) {
        if (tokens[i] === ';') {
          i++;
        } else {
          const start = i;
          i++;
          while (i < tokenAmt && tokens[i] !== ';') {
            i++;
          }
          const end = i;
          stmts.push(tokens.slice(start, end));
        }
      }
      return stmts;
    },

    printErr: (text: string) => {
      visualHistoryDispatch({
        type: VisualHistoryActionType.PushItem,
        item: {
          type: VisualHistoryItemType.Error,
          content: text,
          prompt: props.prompt || defaultConfiguration.prompt,
        },
      });
    },

    printOut: (text: string) => {
      visualHistoryDispatch({
        type: VisualHistoryActionType.PushItem,
        item: {
          type: VisualHistoryItemType.Output,
          content: text,
          prompt: props.prompt || defaultConfiguration.prompt,
        },
      });
    },

    tokenize: (programText: string) => {
      const tokens = [];
      let i = 0;
      const textSize = programText.length;
      while (i < textSize) {
        if (programText[i].match(/\s/)) {
          i++;
        } else if (programText[i] === ';') {
          tokens.push(';');
          i++;
        } else {
          const start = i;
          i++;
          while (i < textSize && !programText[i].match(/[;\s]/)) {
            i++;
          }
          const end = i;
          tokens.push(programText.slice(start, end));
        }
      }
      return tokens;
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
    if (inputRef && inputRef.current && props.autoFocus) {
      inputRef.current.click();
      inputRef.current.focus();
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
            setInputValue('');
          } else {
            const newCommand = commandHistory[newPosition];
            setInputValue(newCommand.input);
          }
          setCommandHistoryPosition(newPosition);
        }
        break;
      case 'ArrowLeft':
        const leftCaret: any = inputRef.current?.selectionStart;
        if (leftCaret !== 0) {
          inputRef.current?.setSelectionRange(leftCaret - 1, leftCaret - 1);
        }
        break;
      case 'ArrowRight':
        const rightCaret: any = inputRef.current?.selectionStart;
        inputRef.current?.setSelectionRange(rightCaret + 1, rightCaret + 1);
        break;
      case 'ArrowUp':
        if (commandHistoryPosition < commandHistory.length - 1) {
          const newPosition = commandHistoryPosition + 1;
          const newCommand = commandHistory[newPosition];
          setInputValue(newCommand.input);
          setCommandHistoryPosition(newPosition);
        }
        break;
      case 'Backspace':
        const backspaceCaret: any = inputRef.current?.selectionStart;
        const backspaceValue = inputValue.slice(0, backspaceCaret - 1) + inputValue.slice(backspaceCaret);
        inputRef.current?.setSelectionRange(backspaceCaret + 1, backspaceCaret + 1);
        if (inputRef && inputRef.current) {
          inputRef.current.value = backspaceValue;
        }
        setInputValue(backspaceValue);
        break;
      case 'Delete':
        const deleteCaret: any = inputRef.current?.selectionStart;
        const deleteValue = inputValue.slice(0, deleteCaret) + inputValue.slice(deleteCaret + 1);
        if (inputRef && inputRef.current) {
          inputRef.current.value = deleteValue;
        }
        setInputValue(deleteValue);
        break;
      case 'Enter':
        commandHistoryDispatch({
          input: inputValue,
        });
        visualHistoryDispatch({
          type: VisualHistoryActionType.PushItem,
          item: {
            type: VisualHistoryItemType.Input,
            content: inputValue,
            prompt: props.prompt || defaultConfiguration.prompt,
          },
        });
        const tokens = kernel.tokenize(inputValue);
        const stmts = kernel.parse(tokens);
        stmts.forEach(stmt => kernel.execute(stmt));
        setInputValue('');
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
            const inputCaret: any = inputRef.current?.selectionStart;
            const keyValue = inputValue.slice(0, inputCaret) + e.key + inputValue.slice(inputCaret);
            inputRef.current?.setSelectionRange(inputCaret + 1, inputCaret + 1);
            setInputValue(keyValue);
          }
        }
        break;
    }
  }, [visualHistory, inputValue]);

  return (
    <div
      className={`${styles.base} unixorn-base`}
      ref={baseRef}
      tabIndex={1}
      onClick={() => {
        inputRef.current?.click();
        inputRef.current?.focus();
      }}
    >
      {visualHistory.map((item, idx) => {
        switch (item.type) {
          case VisualHistoryItemType.Input:
            return (
              <div key={idx}>
                <span
                  className={`${css(styles.text, styles.prompt)} unixorn-prompt`}
                >
                  {item.prompt}
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
            <input
              className={`${css(styles.text, styles.textInputField, {width: inputValue.length + 'ch'})} unixorn-input unixorn-current`}
              onKeyDown={handleKeyDown}
              value={inputRender}
              ref={inputRef}
            />
          </span>
        </span>
      </div>
    </div>
  );
};

const styles = {
  base: css({
    backgroundColor: '#000000',
    height: '100%',
    overflowY: 'auto',
    width: '100%',
  }),
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
  textInputField: css({
    color: 'inherit',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    font: 'inherit',
    minWidth: '4px',
  }),
  textOutput: css({
    color: '#FFFFFF',
  }),
  textError: css({
    color: '#FF0000',
  }),
};

export { Unixorn, defaultConfiguration };
