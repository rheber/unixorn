import { UnixornCommand, UnixornKernel } from "./types";

const visit: UnixornCommand = {
  name: "visit",
  usage: "visit URL",
  summary: "Visit a URL",
  action: (kernel: UnixornKernel, params: string[]) => {
    if (params.length < 2) {
      kernel.printErr('Error: visit expects exactly 1 argument.');
      return;
    }
    kernel.visit(params[1]);
  },
};

const defaultCommands = [
  visit,
];

export { defaultCommands };
