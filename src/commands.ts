import { UnixornCommand, UnixornKernel, UnixornKeybinding } from './interfaces';
import { keybindingName } from './keybindings';

/**
 * Default commands that a new Unixorn component will
 * be initialized with if the commands prop is not set.
 */
const defaultCommands: UnixornCommand[] = [
  {
    name: 'clear',
    usage: 'clear',
    summary: 'Clear screen.',
    action: (kernel: UnixornKernel, _tokens: string[]) => {
      kernel.clearScreen();
    },
  },
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
      const padLength = 24;

      const keybindingList = (keybindings: UnixornKeybinding[]): string[] => {
        return keybindings.sort((a: UnixornKeybinding, b: UnixornKeybinding): number => {
          if (a.key !== b.key) {
            return a.key <= b.key ? -1 : 1;
          }
          if (a.meta !== b.meta) {
            return b.meta ? -1 : 1;
          }
          return b.ctrl ? -1 : 1;
        }).map(keybinding => {
          return keybindingName(keybinding).padEnd(padLength) + keybinding.summary;
        });
      };

      kernel.printOut('Commands:');
      kernel.printOut('\n');
      kernel.commands().forEach(command => {
        kernel.printOut(`${command.usage}`.padEnd(padLength) + command.summary);
      });

      kernel.printOut('\n');
      kernel.printOut('Keybindings:');
      kernel.printOut('\n');
      kernel.printOut('down'.padEnd(padLength) + 'Retrieve later command in history.\n');
      kernel.printOut('up'.padEnd(padLength) + 'Retrieve earlier command in history.\n');
      keybindingList(kernel.keybindings()).forEach(message => {
        kernel.printOut(message);
      });

      kernel.printOut('\n');
      kernel.printOut('Syntax:');
      kernel.printOut('\n');
      kernel.printOut('a;b'.padEnd(padLength) + 'Execute a, then execute b.\n');
    },
  },
  {
    name: 'type',
    usage: 'type NAME [NAME ...]',
    summary: 'Indicate how each name would be interpreted as a command.',
    action: (kernel: UnixornKernel, tokens: string[]) => {
      const builtins = kernel.commands();
      for (let i = 1; i < tokens.length; i++) {
        const name = tokens[i];
        const builtin = builtins.find(c => c.name === name);
        if (builtin) {
          kernel.printOut(`${name} is a shell builtin`);
        } else {
          kernel.printOut(`${name} is not a known command`);
        }
      }
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
