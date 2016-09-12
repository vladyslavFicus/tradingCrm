import React from 'react';
import classNames from 'classnames';

export const renderInput = ({ input, label, type, values, meta: { touched, error } }) => {
  if (type === 'select') {
    return <select {...input}
                   className={classNames('form-control', { 'has-danger': touched && error })}>
      {Object.keys(values).map((key) => <option key={key} value={key}>{values[key]}</option>)}
    </select>;
  } else {
    return <input
      {...input}
      placeholder={label}
      type={type}
      className={classNames('form-control', { 'has-danger': touched && error })}
    />;
  }
};

export const renderField = ({ input, label, type, values, meta: { touched, error } }) => (
  <div className={classNames('form-group row', { 'has-danger': touched && error })}>
    <div className="col-md-3">
      <label className="form-control-label">
        {label}
      </label>
    </div>
    <div className="col-md-9">
      {renderInput({ input, label, type, values, meta: { touched, error } })}
      {touched && error && <div className="form-control-feedback">
        {error}
      </div>}
    </div>
  </div>
);

export const renderError = ({ input, label, type, values, meta: { touched, error } }) => (<div>
  {renderInput({ input, label, type, values, meta: { touched, error } })}
  {touched && error && <div className="form-control-feedback">
    {error}
  </div>}
</div>);

export const formErrorSelector = (formName) => {
  return (state) => {
    const formData = state.form[formName];

    if (!formData || !formData.fields || !formData.syncErrors) {
      return {};
    }

    return Object.keys(formData.fields).reduce((result, fieldName) => {
      if (formData.fields[fieldName] && formData.fields[fieldName].touched && formData.syncErrors[fieldName]) {
        result[fieldName] = formData.syncErrors[fieldName];
      }

      return result;
    }, {});
  };
};
