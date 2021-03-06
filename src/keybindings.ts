import { UnixornKeybinding, UnixornKernel } from '.';

const keybindingName = (keybinding: UnixornKeybinding): string => {
  return `${keybinding.ctrl ? 'ctrl-' : ''}${keybinding.meta ? 'meta-' : ''}${keybinding.key}`;
};

/**
 * Default keybindings that a new Unixorn component will
 * be initialized with if the keybindings prop is not set.
 */
const defaultKeybindings: UnixornKeybinding[] = [
  {
    key: 'a',
    ctrl: true,
    meta: false,
    summary: 'Move cursor to start of line.',
    action: (kernel: UnixornKernel) => {
      kernel.moveCursorToStart();
    },
  },
  {
    key: 'e',
    ctrl: true,
    meta: false,
    summary: 'Move cursor to end of line.',
    action: (kernel: UnixornKernel) => {
      kernel.moveCursorToEnd();
    },
  },
  {
    key: 'k',
    ctrl: true,
    meta: false,
    summary: 'Delete all characters after cursor.',
    action: (kernel: UnixornKernel) => {
      kernel.deleteToEnd();
    },
  },
  {
    key: 'u',
    ctrl: true,
    meta: false,
    summary: 'Delete all characters before cursor.',
    action: (kernel: UnixornKernel) => {
      kernel.deleteToStart();
    },
  },
];

export { defaultKeybindings, keybindingName };
