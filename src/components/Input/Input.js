import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import './input.scss';

class Input extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    step: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    disabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    labelTooltip: PropTypes.string,
    icon: PropTypes.string,
    addition: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    additionPosition: PropTypes.string,
    onAdditionClick: PropTypes.func,
    showErrorMessage: PropTypes.bool,
    digitsAfterDot: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
  };

  static defaultProps = {
    error: null,
    type: 'string',
    step: '1',
    min: null,
    max: null,
    disabled: false,
    isFocused: false,
    className: '',
    label: '',
    labelTooltip: '',
    value: '',
    icon: null,
    addition: null,
    additionPosition: '',
    onChange: () => {},
    onKeyDown: () => {},
    onAdditionClick: () => {},
    showErrorMessage: true,
    digitsAfterDot: null,
  };

  onKeyDown = (e) => {
    const { type, onKeyDown } = this.props;

    if (type === 'number' && e.code === 'ArrowUp') {
      this.increaseValue();

      e.preventDefault();
    }

    if (type === 'number' && e.code === 'ArrowDown') {
      this.decreaseValue();

      e.preventDefault();
    }

    onKeyDown(e);
  };

  increaseValue = () => {
    const value = parseFloat(this.props.value) || 0;
    const step = parseFloat(this.props.step);
    const digitsAfterPoint = (this.props.step.split('.')[1] || '').length;

    // Fixed {{digitsAfterPoint}} of symbols after point
    const result = (value + step).toFixed(digitsAfterPoint);

    this.onChange(result);
  };

  decreaseValue = () => {
    const value = parseFloat(this.props.value) || 0;
    const step = parseFloat(this.props.step);
    const digitsAfterPoint = (this.props.step.split('.')[1] || '').length;

    // Fixed {{digitsAfterPoint}} of symbols after point
    const result = (value - step).toFixed(digitsAfterPoint);

    this.onChange(result);
  };

  onChange = (_value) => {
    const { type, min, max } = this.props;

    let value = _value;

    if (type === 'number' && value !== '') {
      value = value
        .replace(/[^0-9.-]/g, '') // remove chars except number, hyphen, point.
        .replace(/(\..*)\./g, '$1') // remove multiple points.
        .replace(/(?!^)-/g, '') // remove middle hyphen.
        .replace(/^0+(\d)/gm, '$1'); // remove multiple leading zeros

      const isLastSymbolDot = value[value.length - 1] === '.';

      // Set min value if current value less or equal then min
      if (!isLastSymbolDot && min !== null && value <= min) {
        value = min;
      }

      // Set max value if current value greater or equal then max
      if (!isLastSymbolDot && max !== null && value >= max) {
        value = max;
      }
    }

    this.props.onChange(value);
  };

  render() {
    const {
      name,
      value,
      type,
      onChange,
      onKeyDown,
      error,
      disabled,
      isFocused,
      className,
      label,
      icon,
      addition,
      labelTooltip,
      additionPosition,
      onAdditionClick,
      showErrorMessage,
      digitsAfterDot,
      ...input
    } = this.props;

    const inputProps = {
      className: 'input__control',
      name,
      value: digitsAfterDot ? Number(value).toFixed(digitsAfterDot) : value,
      disabled,
      type: type === 'number' ? 'string' : type,
      onChange: e => this.onChange(e.target.value),
      onKeyDown: this.onKeyDown,
      ...input,
    };

    const uniqueId = `label-${name}`;

    return (
      <div
        className={classNames('input', className, {
          'input--has-icon': icon,
          'input--has-error': error && showErrorMessage,
          'input--is-disabled': disabled,
          'input--has-addition': addition && additionPosition !== 'right',
          'input--is-focused': isFocused,
        })}
      >
        <If condition={label}>
          <label className="input__label">{label}</label>
          <If condition={labelTooltip}>
            <span id={uniqueId} className="input__label-icon">
              <i className="input__icon-info fa fa-info-circle" />
            </span>
            <UncontrolledTooltip
              target={uniqueId}
            >
              {labelTooltip}
            </UncontrolledTooltip>
          </If>
        </If>
        <div className="input__body">
          <input {...inputProps} />
          <If condition={icon}>
            <i className={classNames(icon, 'input__icon')} />
          </If>
          <If condition={addition}>
            <div
              className={classNames('input__addition', {
                'input__addition--right': additionPosition === 'right',
              })}
              onClick={onAdditionClick}
            >
              {addition}
            </div>
          </If>
        </div>
        <If condition={error && showErrorMessage}>
          <div className="input__footer">
            <div className="input__error">
              <i className="input__error-icon icon-alert" />
              {error}
            </div>
          </div>
        </If>
      </div>
    );
  }
}

export default Input;
