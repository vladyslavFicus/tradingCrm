import React, { PropTypes } from 'react';
import classNames from 'classnames';

const SelectField = (props) => {
  const { input, label, children, multiple, disabled, meta: { touched, error } } = props;

  return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
    <div className="col-md-3">
      <label className="form-control-label">
        {label}
      </label>
    </div>
    <div className="col-md-9">
      <select
        {...input}
        multiple={multiple}
        disabled={disabled}
        className={classNames('form-control', { 'has-danger': touched && error })}
      >
        {children}
      </select>
      {touched && error && <div className="form-control-feedback">
        {error}
      </div>}
    </div>
  </div>;
};

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SelectField;
