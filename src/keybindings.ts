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
];

export { defaultKeybindings };
