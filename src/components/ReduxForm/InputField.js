import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class InputField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    labelAddon: PropTypes.any,
    inputClassName: PropTypes.string,
    placeholder: PropTypes.string,
    inputAddon: PropTypes.element,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
    type: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    iconLeftClassName: PropTypes.string,
    iconRightClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    id: PropTypes.string,
  };
  static defaultProps = {
    className: 'form-group',
    label: null,
    labelAddon: null,
    inputClassName: 'form-control',
    showInputButton: false,
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    placeholder: null,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputButton: null,
    iconLeftClassName: '',
    iconRightClassName: '',
    labelClassName: null,
    id: null,
  };

  renderLabel = (props) => {
    const {
      label,
      labelClassName,
      labelAddon,
      position,
    } = props;

    if (!label) {
      return null;
    }

    const labelNode = (
      !labelAddon
        ? <label className={labelClassName}>{label}</label>
        : <label className={labelClassName}>{label} {labelAddon}</label>
    );

    return position === 'vertical'
      ? labelNode
      : <div className="col-md-3">{labelNode}</div>;
  };

  renderHorizontal = (props) => {
    const {
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames(`${className} row`, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        <div className="col-md-9">
          {this.renderInput(props)}
          {
            showErrorMessage && touched && error &&
            <div className="form-control-feedback">
              <i className="nas nas-field_alert_icon" />
              {error}
            </div>
          }
        </div>
      </div>
    );
  };

  renderVertical = (props) => {
    const {
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames(className, { 'has-danger': touched && error })}>
        {this.renderLabel(props)}
        {this.renderInput(props)}
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            <i className="nas nas-field_alert_icon" />
            {error}
          </div>
        }
      </div>
    );
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      inputButton,
      showInputButton,
      input,
      disabled,
      type,
      inputClassName,
      meta: { touched, error },
      placeholder,
      label,
      iconLeftClassName,
      iconRightClassName,
      id,
    } = props;

    let inputField = (
      <input
        {...input}
        id={id}
        disabled={disabled}
        type={type}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
        placeholder={placeholder !== null ? placeholder : label}
      />
    );

    if (iconLeftClassName || iconRightClassName) {
      inputField = (
        <div
          className={classNames('input-with-icon', {
            'input-with-icon__left': !!iconLeftClassName,
            'input-with-icon__right': !!iconRightClassName,
          })}
        >
          {!!iconLeftClassName && <i className={classNames('input-left-icon', iconLeftClassName)} />}
          {inputField}
          {!!iconRightClassName && <i className={classNames('input-right-icon', iconRightClassName)} />}
        </div>
      );
    }

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          {inputAddonPosition === 'right' && inputField}
          <div className="input-group-addon">
            {inputAddon}
          </div>
          {inputAddonPosition === 'left' && inputField}
        </div>
      );
    }

    if (inputButton) {
      inputField = (
        <div className="form-control-with-button">
          {inputField}
          {showInputButton && inputButton}
        </div>
      );
    }

    return inputField;
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default InputField;
