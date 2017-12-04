import React from 'react';
import { shallow, mount } from 'enzyme';
import SelectSingleOptions from '../../../src/components/Select/SelectSingleOptions';

const optionClassName = 'select-search-box__item';
const options = [
  { key: '1', label: '1', value: 1 },
  { key: '2', label: '2', value: 2 },
  { key: '3', label: '3', value: 3 },
];
const selectedOption = options[1];

describe('(Component) SelectSingleOptions', () => {
  let _props, _spies, _wrapper;

  beforeEach(() => {
    _spies = {};
    _props = {
      className: 'select-search-box',
      optionClassName,
      onChange: (_spies.onChange = sinon.spy()),
      options,
      selectedOption,
      bindActiveOption: (_spies.bindActiveOption = sinon.spy()),
    };
    _wrapper = shallow(<SelectSingleOptions {..._props} />);
  });

  it('renders as a <div> with class passed by prop "className"', () => {
    expect(_wrapper.is(`div.${_props.className}`)).to.equal(true);
  });

  it('renders as a null when prop "options" is empty', () => {
    _props.options = [];
    _wrapper = shallow(<SelectSingleOptions {..._props} />);

    expect(_wrapper.type()).to.equal(null);
  });

  it('renders with options passed by prop "options"', () => {
    expect(_wrapper.find(`div.${_props.optionClassName}`)).to.have.length(_props.options.length);
  });

  it('calls "onChange" by clicking an option', () => {
    const option = _wrapper
      .find(`div.${optionClassName}`)
      .filterWhere(i => i.text() === options[2].label);

    option.simulate('click');

    expect(_spies.onChange.calledWith(options[2])).to.equal(true);
  });

  it('renders an selected option with class "is-selected"', () => {
    expect(_wrapper.find(`div.${_props.optionClassName}.is-selected`)).to.have.length(1);
  });

  it('calls "bindActiveOption" when has active option', () => {
    _wrapper = mount(<SelectSingleOptions {..._props} />);

    expect(_spies.bindActiveOption.called).to.equal(true);
  });
});
