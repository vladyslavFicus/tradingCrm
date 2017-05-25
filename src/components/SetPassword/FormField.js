import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FormField = (props) => {
  const {
    input,
    label,
    type,
    disabled,
    meta: { touched, error },
  } = props;

  return (
    <div className={classNames('form-group', { 'has-error': touched && error })}>
      <input
        {...input}
        disabled={disabled}
        type={type}
        className={classNames('form-control', { 'has-danger': touched && error })}
        placeholder={label}
      />
      {touched && !!error && <div className="form-control-error">
        <ul>
          <li>{error}</li>
        </ul>
      </div>}
    </div>
  );
};

FormField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default FormField;
