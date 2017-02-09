import React from 'react';
import classNames from 'classnames';

export default (props) => {
  const { input, label, items = [], disabled, meta: { touched, error } } = props;

  return <div className={classNames('form-group', { 'has-error': touched && error, })}>
    <select
      {...input}
      disabled={disabled}
      className={classNames('form-control', { 'has-danger': touched && error })}
      placeholder={label}
      children={items.map(item => <option value={item.value}>{item.label}</option>)}
    />
    {touched && error && <div className="form-control-error">
      <ul>
        <li>{error}</li>
      </ul>
    </div>}
  </div>
}
