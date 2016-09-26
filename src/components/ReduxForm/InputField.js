import React, { PropTypes } from 'react';
import classNames from 'classnames';

const InputField = (props) => {
  const { input, label, type, disabled, meta: { touched, error } } = props;

  return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
    <div className="col-md-3">
      <label className="form-control-label">
        {label}
      </label>
    </div>
    <div className="col-md-9">
      <input
        {...input}
        disabled={disabled}
        type={type}
        className={classNames('form-control', { 'has-danger': touched && error })}
        placeholder={label}
      />
      {touched && error && <div className="form-control-feedback">
        {error}
      </div>}
    </div>
  </div>;
};

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default InputField;
