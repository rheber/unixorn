import { UnixornCommand, UnixornKernel } from "./types";

const visit: UnixornCommand = {
  usage: "visit URL",
  summary: "Visit a URL",
  action: (kernel: UnixornKernel, params: string[]) => {
    if (params.length === 0) {
      kernel.printErr('Error: visit expects exactly 1 argument.');
      return;
    }
    kernel.visit(params[0]);
  },
};

const defaultCommands = [
  visit,
];

export { defaultCommands };
