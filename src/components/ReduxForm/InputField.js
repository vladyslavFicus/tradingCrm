import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

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
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }).isRequired,
    iconLeftClassName: PropTypes.string,
    iconRightClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    id: PropTypes.string,
    onIconClick: PropTypes.func,
  };
  static defaultProps = {
    className: null,
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
    onIconClick: null,
  };

  renderHorizontal = (props) => {
    const {
      label,
      labelClassName,
      labelAddon,
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames('form-group row', { className }, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          labelClassName={labelClassName}
          addon={labelAddon}
          wrapperTag="div"
          wrapperClassName="col-md-3"
        />
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
      label,
      labelClassName,
      labelAddon,
      className,
      meta: { touched, error },
      showErrorMessage,
    } = props;

    return (
      <div className={classNames('form-group', className, { 'has-danger': touched && error })}>
        <FieldLabel
          label={label}
          labelClassName={labelClassName}
          addon={labelAddon}
        />
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
      onIconClick,
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
          {
            !!iconLeftClassName &&
            <i className={classNames('input-left-icon', iconLeftClassName)} onClick={onIconClick} />
          }
          {inputField}
          {
            !!iconRightClassName &&
            <i className={classNames('input-right-icon', iconRightClassName)} onClick={onIconClick} />
          }
        </div>
      );
    }

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          {inputAddonPosition === 'right' && inputField}
          <span className="input-group-addon">
            {inputAddon}
          </span>
          {inputAddonPosition === 'left' && inputField}
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

export default InputField;
