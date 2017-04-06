import React, { PropTypes } from 'react';
import classNames from 'classnames';

const InputField = (props) => {
  const {
    input,
    label,
    placeholder,
    type,
    wrapperClassName,
    disabled,
    meta: { touched, error },
    inputClassName,
  } = props;

  return (
    <div className={wrapperClassName}>
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        {
          label &&
          <label>{label}</label>
        }
        <input
          {...input}
          disabled={disabled}
          type={type}
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  wrapperClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default InputField;
