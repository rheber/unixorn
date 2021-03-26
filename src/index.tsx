import React from 'react';
import ReactDOM from 'react-dom';
import {
  UnixornCommand as _UnixornCommand,
  UnixornConfiguration as _UnixornConfiguration,
} from './types';
import { Unixorn } from './Unixorn';
import { defaultCommands } from './commands';

const initUnixorn = (
  element: HTMLElement,
  configuration?: UnixornConfiguration,
) => {
  ReactDOM.render(<Unixorn {...configuration} />, element);
};

export type UnixornCommand = _UnixornCommand;
export type UnixornConfiguration = _UnixornConfiguration;

export {
  defaultCommands,
  initUnixorn,
  Unixorn,
};
