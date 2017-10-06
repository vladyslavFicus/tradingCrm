import React from 'react';
import { shallow } from 'enzyme';
import SelectMultipleOptions from '../../../src/components/Select/SelectMultipleOptions';

const optionClassName = 'select-multiple-options__option';
const options = [
  { key: '1', label: '1', value: 1 },
  { key: '2', label: '2', value: 2 },
  { key: '3', label: '3', value: 3 },
];
const selectedOption = options[1];

describe('(Component) SelectMultipleOptions', () => {
  let _props, _spies, _wrapper;

  beforeEach(() => {
    _spies = {};
    _props = {
      headerText: 'Test options',
      className: 'select-multiple-options',
      optionClassName,
      onChange: (_spies.onChange = sinon.spy()),
      options,
      selectedOptions: [selectedOption],
      headerButtonClassName: 'select-multiple-options__header-button',
      headerButtonIconClassName: 'select-multiple-options__header-button-icon',
      headerButtonText: 'Button',
      headerButtonOnClick: (_spies.headerButtonOnClick = sinon.spy()),
    };
    _wrapper = shallow(<SelectMultipleOptions {..._props} />);
  });

  it('renders as a <div> with class passed by prop "className"', () => {
    expect(_wrapper.is(`div.${_props.className}`)).to.equal(true);
  });

  it('renders as a null when prop "options" is empty', () => {
    _props.options = [];
    _wrapper = shallow(<SelectMultipleOptions {..._props} />);

    expect(_wrapper.type()).to.equal(null);
  });

  it('renders with options passed by prop "options"', () => {
    expect(_wrapper.find(`label.${_props.optionClassName}`)).to.have.length(_props.options.length);
  });
});
