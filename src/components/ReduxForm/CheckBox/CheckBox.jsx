import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CheckBox = (props) => {
  const {
    input,
    label,
    disabled,
    id,
    className,
    meta: { touched, error },
  } = props;

  return (
    <div className={classNames('custom-control custom-checkbox text-left', className)}>
      <input
        {...input}
        disabled={disabled}
        type="checkbox"
        className="custom-control-input"
        id={id}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
      <If condition={touched && error}>
        <div className="form-control-feedback">
          <i className="nas nas-field_alert_icon" />
          {error}
        </div>
      </If>
    </div>
  );
};

CheckBox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
};
CheckBox.defaultProps = {
  input: null,
  disabled: false,
  className: null,
};

export default CheckBox;
