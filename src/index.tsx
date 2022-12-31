import React from 'react';
import ReactDOM from 'react-dom';
import { Unixorn } from './Unixorn';
import {
  UnixornConfiguration,
  UnixornCommand,
  UnixornKernel,
  UnixornKeybinding,
  defaultConfiguration,
} from './interfaces';

/**
 * Attach a new Unixorn component to an existing DOM node.
 * @param element The DOM node to which the new Unixorn component should be attached.
 * @param configuration Props to be passed to the new Unixorn component.
 */
const initUnixorn = (
  element: HTMLElement,
  configuration?: UnixornConfiguration,
) => {
  ReactDOM.render(<Unixorn {...configuration} />, element);
};

export type {
  UnixornConfiguration,
  UnixornCommand,
  UnixornKernel,
  UnixornKeybinding,
};

export {
  defaultConfiguration,
  initUnixorn,
  Unixorn,
};
