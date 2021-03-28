import { UnixornKeybinding, UnixornKernel } from '.';

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
