import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class SelectField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string,
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
    inputAddon: PropTypes.element,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
  };
  static defaultProps = {
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    multiple: false,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputButton: null,
    inputClassName: 'form-control select-block',
    showInputButton: false,
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
    } = props;

    let inputField = (
      <select
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

  renderVertical = (props) => {
    const {
      label,
      labelClassName,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label className={labelClassName}>{label}</label>
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

  renderHorizontal = (props) => {
    const {
      label,
      labelClassName,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames('form-group row', { 'has-danger': touched && error })}>
        <div className="col-md-3">
          <label className={labelClassName}>
            {label}
          </label>
        </div>
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

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default SelectField;
