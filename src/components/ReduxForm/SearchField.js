import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const SearchField = (props) => {
  const { input, label, placeholder, disabled, meta: { touched, error }, inputClassName } = props;

  return (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <label>{label}</label>
      <div className="form-input-icon">
        <i className="icmn-search" />
        <input
          {...input}
          disabled={disabled}
          type="text"
          className={classNames('form-control', inputClassName, { 'has-danger': touched && error })}
          placeholder={placeholder}
          title={placeholder}
        />
      </div>
    </div>
  );
};

SearchField.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  label: PropTypes.string,
  inputClassName: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SearchField;
