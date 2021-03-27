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
