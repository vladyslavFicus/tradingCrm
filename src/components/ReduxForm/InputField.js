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
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    labelClassName: PropTypes.string,
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
  };
  static defaultProps = {
    className: 'form-group',
    label: null,
    labelAddon: null,
    labelClassName: 'form-control-label',
    inputClassName: 'form-control',
    showInputButton: false,
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    placeholder: null,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputButton: null,
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
        : <div className={labelClassName}>{label} {labelAddon}</div>
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
    } = props;

    let inputField = (
      <input
        {...input}
        disabled={disabled}
        type={type}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
        placeholder={placeholder !== null ? placeholder : label}
      />
    );

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
          <div className="form-control-button">
            {showInputButton && inputButton}
          </div>
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
