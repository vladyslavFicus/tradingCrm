import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TextAreaField = (props) => {
  const { input, label, type, disabled, meta: { touched, error } } = props;

  return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
    <div className="col-md-3">
      <label className="form-control-label">
        {label}
      </label>
    </div>
    <div className="col-md-9">
      <textarea
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

TextAreaField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
};

export default TextAreaField;
