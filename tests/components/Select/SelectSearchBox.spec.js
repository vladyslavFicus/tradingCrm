import React from 'react';
import { shallow } from 'enzyme';
import SelectSearchBox from '../../../src/components/Select/SelectSearchBox';

describe('(Component) SelectSearchBox', () => {
  let _props, _spies, _wrapper;

  beforeEach(() => {
    _spies = {};
    _props = {
      query: 'bla bla bla',
      placeholder: 'Type query...',
      onChange: (_spies.onChange = sinon.spy())
    };
    _wrapper = shallow(<SelectSearchBox {..._props} />);
  });

  it('renders as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true);
  });

  it('renders with an <input>.', () => {
    expect(_wrapper.find('input')).to.exist();
  });

  it('renders with the <input> that includes props "query" as value.', () => {
    expect(_wrapper.find('input').props().value).to.equal(_props.query);
  });

  it('renders without an <i.nas-clear_icon> when props "query" is empty', () => {
    _props.query = '';
    _wrapper = shallow(<SelectSearchBox {..._props} />);

    expect(_wrapper.find('i.nas-clear_icon')).to.not.exist();
  });

  it('renders with the <i.nas-clear_icon> when props "query" not empty', () => {
    expect(_wrapper.find('i.nas-clear_icon')).to.exist();
  });

  it('calls "onChange" with "null" when <i.nas-clear_icon> clicked', () => {
    _wrapper.find('i.nas-clear_icon').simulate('click');

    expect(_spies.onChange.calledWith(null)).to.equal(true);
  });
});
