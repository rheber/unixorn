import { UnixornCommand, UnixornKernel } from '.';

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
        kernel.printOut(`ctrl-${keybinding.key}`.padEnd(20) + keybinding.summary);
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
