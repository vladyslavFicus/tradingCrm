import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class TextAreaField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelAddon: PropTypes.any,
    inputClassName: PropTypes.string,
    placeholder: PropTypes.string,
    inputAddon: PropTypes.element,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
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
    rows: null,
    id: null,
  };

  renderLabel = (props) => {
    const {
      label,
      labelAddon,
      position,
    } = props;

    if (!label) {
      return null;
    }

    const labelNode = (
      !labelAddon
        ? <label>{label}</label>
        : <div>{label} {labelAddon}</div>
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
      inputClassName,
      meta: { touched, error },
      placeholder,
      label,
      rows,
      id,
    } = props;

    let inputField = (
      <textarea
        {...input}
        disabled={disabled}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
        placeholder={placeholder || label}
        rows={rows}
        id={id}
      />
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

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default TextAreaField;
