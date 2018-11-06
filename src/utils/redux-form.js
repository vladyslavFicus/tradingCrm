import React from 'react';
import classNames from 'classnames';

export const renderInput = ({ input, label, type, values, disabled, meta: { touched, error } }) => {
  if (type === 'select') {
    return <select {...input}
                   disabled={disabled}
                   className={classNames('form-control', { 'has-danger': touched && error })}>
      {Object.keys(values).map((key) => <option key={key} value={key}>{values[key]}</option>)}
    </select>;
  } else {
    return <input
      {...input}
      disabled={disabled}
      placeholder={label}
      type={type}
      className={classNames('form-control', { 'has-danger': touched && error })}
    />;
  }
};

export const renderField = ({ input, label, type, values, disabled, meta: { touched, error } }) => (
  <div className={classNames('form-group row', { 'has-danger': touched && error })}>
    <div className="col-md-3">
      <label>
        {label}
      </label>
    </div>
    <div className="col-md-9">
      {renderInput({ input, label, type, values, disabled, meta: { touched, error } })}
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

const getError = (name, data, errors) => (data.touched && errors[name]) ? errors[name] : null;

const getErrors = (items, name, value, errors) => {
  const error = getError(name, value, errors);

  if (error !== null) {
    items[name] = error;
  } else {
    Object.keys(value).forEach((subName) => {
      items = getErrors(items, `${name}.${subName}`, value[subName], errors);
    });
  }

  return items;
};

export const formErrorSelector = (formName) => (state) => {
  const formData = state.form[formName];

  if (!formData || !formData.fields || !formData.syncErrors) {
    return {};
  }

  return Object.keys(formData.fields).reduce((result, fieldName) => {
    if (formData.fields[fieldName]) {
      result = getErrors(result, fieldName, formData.fields[fieldName], formData.syncErrors);
    }

    return result;
  }, {});
};
