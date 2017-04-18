import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class InputField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    }).isRequired,
    label: PropTypes.string.isRequired,
    labelClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    placeholder: PropTypes.string,
    inputAddon: PropTypes.element,
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
    labelClassName: 'form-control-label',
    inputClassName: 'form-control',
    position: 'horizontal',
    showErrorMessage: true,
    disabled: false,
    placeholder: null,
    inputAddon: null,
  };

  renderHorizontal = (props) => {
    const {
      input,
      label,
      placeholder,
      labelClassName,
      inputClassName,
      type,
      disabled,
      meta: { touched, error },
      showErrorMessage,
      inputAddon,
    } = props;

    return (
      <div className={classNames('form-group row', { 'has-danger': touched && error })}>
        <div className="col-md-3">
          <label className={labelClassName}> {label} </label>
        </div>
        <div className="col-md-9">
          <div className="input-group">
            {
              inputAddon &&
              <div className="input-group-addon">
                {inputAddon}
              </div>
            }
            <input
              {...input}
              disabled={disabled}
              type={type}
              className={classNames(inputClassName, { 'has-danger': touched && error })}
              placeholder={placeholder || label}
            />
            {
              showErrorMessage && touched && error &&
              <div className="form-control-feedback">
                {error}
              </div>
            }
          </div>
        </div>
      </div>
    );
  };

  renderVertical = (props) => {
    const {
      input,
      label,
      labelClassName,
      inputClassName,
      placeholder,
      type,
      disabled,
      meta: { touched, error },
      showErrorMessage,
      inputAddon,
    } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        <label className={labelClassName}>{label}</label>
        <div className="input-group">
          {
            inputAddon &&
            <div className="input-group-addon">
              {inputAddon}
            </div>
          }
          <input
            {...input}
            disabled={disabled}
            type={type}
            className={classNames(inputClassName, { 'has-danger': touched && error })}
            placeholder={placeholder || label}
          />
        </div>
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            {error}
          </div>
        }
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default InputField;
