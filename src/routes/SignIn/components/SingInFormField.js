import React from 'react';
import classNames from 'classnames';

export default (props) => {
  const { input, label, type, disabled, meta: { touched, error } } = props;

  return <div className={classNames('form-group', { 'has-error': touched && error, })}>
    <input
      {...input}
      disabled={disabled}
      type={type}
      className={classNames('form-control', { 'has-danger': touched && error })}
      placeholder={label}
    />
    {touched && error && <div className="form-control-error">
      <ul>
        <li>{error}</li>
      </ul>
    </div>}
  </div>
}
