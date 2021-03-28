import React from 'react';
import ReactDOM from 'react-dom';
import { Unixorn } from './Unixorn';

describe('Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Unixorn />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
