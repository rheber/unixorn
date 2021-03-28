import { UnixornKeybinding, UnixornKernel } from '.';

/**
 * Default keybindings that a new Unixorn component will
 * be initialized with if the keybindings prop is not set.
 */
const defaultKeybindings: UnixornKeybinding[] = [
  {
    key: 'a',
    summary: 'Move cursor to start of line.',
    action: (kernel: UnixornKernel) => {
      kernel.moveCursorToStart();
    },
  },
  {
    key: 'e',
    summary: 'Move cursor to end of line.',
    action: (kernel: UnixornKernel) => {
      kernel.moveCursorToEnd();
    },
  },
  {
    key: 'k',
    summary: 'Delete all characters after cursor.',
    action: (kernel: UnixornKernel) => {
      kernel.deleteToEnd();
    },
  },
  {
    key: 'u',
    summary: 'Delete all characters before cursor.',
    action: (kernel: UnixornKernel) => {
      kernel.deleteToStart();
    },
  },
];

export { defaultKeybindings };
