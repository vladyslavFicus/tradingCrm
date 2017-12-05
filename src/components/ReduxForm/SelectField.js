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
    label: PropTypes.string,
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
    onRemoveClick: PropTypes.func,
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
    labelClassName: '',
    meta: {
      touched: false,
      error: '',
    },
    onRemoveClick: null,
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
      onRemoveClick,
    } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        {label && (
          <label className={labelClassName}>
            {label}
            {onRemoveClick && <button className="nas nas-clear_icon label-clear" onClick={onRemoveClick} />}
          </label>)
        }
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

  renderHorizontal = (props) => {
    const {
      label,
      labelClassName,
      meta: { touched, error },
      showErrorMessage,
      onRemoveClick,
    } = props;

    return (
      <div className={classNames('form-group row', { 'has-danger': touched && error })}>
        <div className="col-md-3">
          <label className={labelClassName}>
            {label}
            {onRemoveClick && <button className="nas nas-clear_icon label-clear" onClick={onRemoveClick} />}
          </label>
        </div>
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

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default SelectField;
