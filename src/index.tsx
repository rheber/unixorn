import React from 'react'
import ReactDOM from 'react-dom'
import { UnixornCommand, UnixornConfiguration } from './types';
import { Unixorn } from './Unixorn';

const initUnixorn = (
  element: HTMLElement,
  configuration?: UnixornConfiguration
) => {
  ReactDOM.render(<Unixorn {...configuration} />, element)
};

export {
  initUnixorn,
  Unixorn,
  UnixornCommand,
  UnixornConfiguration,
};
