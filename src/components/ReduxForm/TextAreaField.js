import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

const TextAreaField = (props) => {
  const {
    className,
    input,
    label,
    labelAddon,
    labelClassName,
    placeholder,
    showErrorMessage,
    disabled,
    meta: { touched, error },
    id,
    helpText,
    maxLength,
  } = props;

  const groupClassName = classNames(
    'form-group',
    className,
    { 'has-danger': touched && error },
    { 'is-disabled': disabled },
  );

  return (
    <div className={groupClassName}>
      <FieldLabel
        label={label}
        addon={labelAddon}
        className={labelClassName}
      />
      <textarea
        {...input}
        disabled={disabled}
        className="form-control"
        placeholder={placeholder}
        maxLength={maxLength}
        id={id}
      />
      <If condition={helpText || (showErrorMessage && touched && error)}>
        <div className="form-row">
          <If condition={showErrorMessage && touched && error}>
            <div className="col form-control-feedback">
              <i className="icon icon-alert" />
              {error}
            </div>
          </If>
          <If condition={helpText}>
            <div className="col form-group-help">
              {helpText}
            </div>
          </If>
        </div>
      </If>
    </div>
  );
};

TextAreaField.propTypes = {
  className: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  }).isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  labelAddon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  labelClassName: PropTypes.string,
  placeholder: PropTypes.string,
  showErrorMessage: PropTypes.bool,
  disabled: PropTypes.bool,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  id: PropTypes.string,
  helpText: PropTypes.node,
  maxLength: PropTypes.string,
};
TextAreaField.defaultProps = {
  className: null,
  label: null,
  labelAddon: null,
  labelClassName: null,
  placeholder: null,
  showErrorMessage: true,
  disabled: false,
  id: null,
  helpText: null,
  maxLength: null,
};

export default TextAreaField;
