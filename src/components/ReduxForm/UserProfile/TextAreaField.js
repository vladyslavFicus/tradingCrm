import React, { PropTypes } from 'react';
import classNames from 'classnames';

const TextAreaField = (props) => {
  const { input, label, type, disabled, wrapperClassName, meta: { touched, error } } = props;

  return (
    <div className={wrapperClassName}>
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <textarea
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

TextAreaField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextAreaField;
