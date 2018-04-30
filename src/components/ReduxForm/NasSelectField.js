import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../Select';
import FieldLabel from './FieldLabel';

class NasSelectField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    placeholder: PropTypes.string,
    labelClassName: PropTypes.string,
    labelAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    inputClassName: PropTypes.string,
    inputAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    optionsHeader: PropTypes.func,
    singleOptionComponent: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    helpText: PropTypes.node,
  };
  static defaultProps = {
    position: 'horizontal',
    placeholder: null,
    className: '',
    labelClassName: null,
    labelAddon: null,
    showErrorMessage: true,
    disabled: false,
    multiple: false,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputClassName: 'form-control select-block',
    optionsHeader: null,
    singleOptionComponent: null,
    id: null,
    helpText: null,
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      input,
      disabled,
      inputClassName,
      meta: { touched, error },
      children,
      multiple,
      placeholder,
      optionsHeader,
      singleOptionComponent,
      id,
    } = props;

    let inputField = (
      <Select
        {...input}
        placeholder={placeholder}
        optionsHeader={optionsHeader}
        singleOptionComponent={singleOptionComponent}
        disabled={disabled}
        multiple={multiple}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
        id={id}
      >
        {children}
      </Select>
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

    return inputField;
  };

  renderVertical = (props) => {
    const {
      label,
      labelClassName,
      className,
      labelAddon,
      meta: { touched, error },
      showErrorMessage,
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

export default NasSelectField;
