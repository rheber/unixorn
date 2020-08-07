import { UnixornKernel } from './types';

const unixornKernelImplementation: UnixornKernel = {
  printErr: (text: string) => console.error(text),

  printOut: (text: string) => console.info(text),

  visit: (url: string) => {
    if(url.includes('://')) {
      window.open(url);
      return;
    }
    window.open(`https://${url}`);
  },
};

export { unixornKernelImplementation };
