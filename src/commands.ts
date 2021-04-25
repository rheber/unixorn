import { UnixornCommand, UnixornKernel } from '.';
import { keybindingName } from './keybindings';

/**
 * Default commands that a new Unixorn component will
 * be initialized with if the commands prop is not set.
 */
const defaultCommands: UnixornCommand[] = [
  {
    name: 'echo',
    usage: 'echo [ARGS]',
    summary: 'Print arguments.',
    action: (kernel: UnixornKernel, tokens: string[]) => {
      const output = tokens.slice(1).join(' ');
      kernel.printOut(output);
    },
  },
  {
    name: 'help',
    usage: 'help',
    summary: 'Show this message.',
    action: (kernel: UnixornKernel, _tokens: string[]) => {
      kernel.printOut('Commands:');
      kernel.printOut('\n');
      kernel.commands().forEach(command => {
        kernel.printOut(`${command.usage}`.padEnd(20) + command.summary);
      });
      kernel.printOut('\n');
      kernel.printOut('Keybindings:');
      kernel.printOut('\n');
      kernel.keybindings().forEach(keybinding => {
        kernel.printOut(keybindingName(keybinding).padEnd(20) + keybinding.summary);
      });
    },
  },
  {
    name: 'visit',
    usage: 'visit URL',
    summary: 'Visit a URL.',
    action: (kernel: UnixornKernel, tokens: string[]) => {
      if (tokens.length < 2) {
        kernel.printErr('Error: visit expects exactly 1 argument.');
        return;
      }
      kernel.visit(tokens[1]);
    },
  },
];

export { defaultCommands };
