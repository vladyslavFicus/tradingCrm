import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

class SelectField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.string,
    labelAddon: PropTypes.any,
    labelClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
    inputClassName: PropTypes.string,
    inputAddon: PropTypes.element,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
    id: PropTypes.string,
    className: PropTypes.string,
    helpText: PropTypes.node,
  };
  static defaultProps = {
    id: null,
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    multiple: false,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputButton: null,
    inputClassName: 'form-control',
    showInputButton: false,
    label: null,
    labelAddon: null,
    labelClassName: '',
    meta: {
      touched: false,
      error: '',
    },
    className: null,
    helpText: null,
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      inputButton,
      showInputButton,
      input,
      disabled,
      inputClassName,
      meta: { touched, error },
      children,
      multiple,
      id,
    } = props;

    let inputField = (
      <select
        id={id}
        {...input}
        disabled={disabled}
        multiple={multiple}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
      >
        {children}
      </select>
    );

    if (inputAddon) {
      inputField = (
        <div className={classNames('input-group', { disabled })}>
          <If condition={inputAddonPosition === 'left'}>
            <div className="input-group-prepend">
              <span className="input-group-text input-group-addon">
                {inputAddon}
              </span>
            </div>
          </If>
          {inputField}
          <If condition={inputAddonPosition === 'right'}>
            <div className="input-group-append">
              <span className="input-group-text input-group-addon">
                {inputAddon}
              </span>
            </div>
          </If>
        </div>
      );
    }

    if (inputButton) {
      inputField = (
        <div className="input-group">
          {inputField}
          <span className="input-group-btn">
            {showInputButton && inputButton}
          </span>
        </div>
      );
    }

    return inputField;
  };

  renderVertical = (props) => {
    const {
      label,
      labelAddon,
      labelClassName,
      meta: { touched, error },
      showErrorMessage,
      className,
      helpText,
    } = props;

    return (
      <div className={classNames('form-group', className, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          addon={labelAddon}
          className={labelClassName}
        />
        {this.renderInput(props)}
        <If condition={helpText}>
          <div className="form-group-help">
            {helpText}
          </div>
        </If>
        <If condition={showErrorMessage && touched && error}>
          <div className="form-control-feedback">
            <i className="nas nas-field_alert_icon" />
            {error}
          </div>
        </If>
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      label,
      meta: { touched, error },
      showErrorMessage,
      className,
      helpText,
    } = props;

    return (
      <div className={classNames('form-group row', className, { 'has-danger': touched && error })}>
        <label className="col-md-3">{label}</label>
        <div className="col-md-9">
          {this.renderInput(props)}
          <If condition={helpText}>
            <div className="form-group-help">
              {helpText}
            </div>
          </If>
          <If condition={showErrorMessage && touched && error}>
            <div className="form-control-feedback">
              <i className="nas nas-field_alert_icon" />
              {error}
            </div>
          </If>
        </div>
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default SelectField;
