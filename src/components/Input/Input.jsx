import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './input.scss';

class Input extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    icon: PropTypes.string,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.string,
    maxLength: PropTypes.number,
    onMaxLengthEntered: PropTypes.func,
    onTruncated: PropTypes.func,
    onChange: PropTypes.func,
    className: PropTypes.string,
    addition: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onAdditionClick: PropTypes.func,
    validateInput: PropTypes.func,
    onEnterPress: PropTypes.func,
    mobileType: PropTypes.oneOf(['tel', 'number']),
    verified: PropTypes.bool,
    verifiedText: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    label: null,
    icon: null,
    error: null,
    value: '',
    defaultValue: undefined,
    maxLength: null,
    onMaxLengthEntered: () => {},
    onTruncated: () => {},
    onChange: () => {},
    className: null,
    addition: null,
    onAdditionClick: () => {},
    validateInput: () => true,
    onEnterPress: () => true,
    mobileType: undefined,
    verified: false,
    verifiedText: null,
    type: undefined,
  };

  state = {
    mounted: false, // eslint-disable-line
  };

  static getDerivedStateFromProps(props, state) {
    const { value, defaultValue } = props;
    const { mounted } = state;

    if (!mounted) {
      return { value: value || defaultValue || '', mounted: true };
    }

    if (value !== undefined) {
      return { value };
    }

    return null;
  }

  onChange = (e) => {
    const { value, type, validity: { valid } } = e.target;
    const {
      maxLength,
      onChange,
      onMaxLengthEntered,
      onTruncated,
      validateInput,
    } = this.props;

    if ((valid || type === 'email') && validateInput(value)) {
      // Fire onChange event if input value was changed
      onChange(e);

      // Fire onTruncated event if input value empty
      if (value.length === 0) {
        onTruncated();
      }

      // Fire onMaxLengthEntered event if input value reached max length
      if (maxLength && onMaxLengthEntered && value.length === maxLength) {
        onMaxLengthEntered();
      }
    }
  };

  onKeyDown = (e) => {
    const { target: { value }, keyCode } = e;
    const { onTruncated, onEnterPress } = this.props;

    // Fire onTruncated event if input value empty
    if (keyCode === 8 && onTruncated && value.length === 0) {
      onTruncated();
    }
    if (keyCode === 13) {
      onEnterPress(this);
    }
  };

  render() {
    const {
      label,
      onMaxLengthEntered,
      onTruncated,
      validateInput,
      onEnterPress,
      defaultValue,
      onChange,
      type,
      icon,
      error,
      className,
      addition,
      onAdditionClick,
      mobileType,
      verified,
      verifiedText,
      ...input
    } = this.props;

    const { value } = this.state;

    const props = {
      type,
      ...input,
      value,
      onChange: this.onChange,
      ref: (_input) => {
        this._input = _input;
      },
      onKeyDown: this.onKeyDown,
      className: classNames('input__control', { 'input__control--verified': verified }, input.className),
    };

    return (
      <div
        className={classNames('input', className, {
          'input--has-icon': icon,
          'input--has-error': !!error,
          'input--is-disabled': !verified && props.disabled,
          'input--has-addition': addition,
          'input--verified': verified,
        })}
      >
        <div className="input__body">
          <If condition={label}>
            <label className="input__label">{label}</label>
          </If>
          <input {...props} />
          <If condition={icon}>
            <i className={classNames(icon, 'input__icon')} />
          </If>
          <If condition={addition}>
            <div
              className="input__addition"
              onClick={onAdditionClick}
            >
              {addition}
            </div>
          </If>
        </div>
        <If condition={error}>
          <div className="input__footer">
            <div className="input__error">
              <i className="input__error-icon icon-alert" />
              {error}
            </div>
          </div>
        </If>
        <If condition={verified}>
          <div className="input__footer">
            <div className="input__verified-message">
              {verifiedText || 'Verified'}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default Input;
