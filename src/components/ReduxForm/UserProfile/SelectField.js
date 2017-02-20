import React, { PropTypes } from 'react';
import classNames from 'classnames';

const SelectField = (props) => {
  const { input, label, children, wrapperClassName, meta: { touched, error } } = props;

  return (
    <div className={wrapperClassName}>
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label>{label}</label>
        <select
          {...input}
          className={classNames('form-control', { 'has-danger': touched && error })}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

SelectField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SelectField;
