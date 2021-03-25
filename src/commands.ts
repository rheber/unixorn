import { UnixornCommand, UnixornKernel } from "./types";

const echo: UnixornCommand = {
  name: "echo",
  usage: "echo [ARGS]",
  summary: "Print arguments.",
  action: (kernel: UnixornKernel, tokens: string[]) => {
    const output = tokens.slice(1).join(" ");
    kernel.printOut(output);
  },
};

const visit: UnixornCommand = {
  name: "visit",
  usage: "visit URL",
  summary: "Visit a URL.",
  action: (kernel: UnixornKernel, tokens: string[]) => {
    if (tokens.length < 2) {
      kernel.printErr('Error: visit expects exactly 1 argument.');
      return;
    }
    kernel.visit(tokens[1]);
  },
};

const defaultCommands = [
  echo,
  visit,
];

export { defaultCommands };
