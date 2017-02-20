import React, { PropTypes } from 'react';
import classNames from 'classnames';

const InputField = (props) => {
  const { input, label, type, wrapperClassName, disabled, meta: { touched, error } } = props;

  return (
    <div className={wrapperClassName}>
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', { 'has-danger': touched && error })}
          placeholder={label}
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputField;
