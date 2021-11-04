import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import './input.scss';

class Input extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
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
    additionClassName: PropTypes.string,
    additionPosition: PropTypes.string,
    onAdditionClick: PropTypes.func,
    showErrorMessage: PropTypes.bool,
  };

  static defaultProps = {
    error: null,
    disabled: false,
    isFocused: false,
    className: '',
    label: '',
    labelTooltip: '',
    value: '',
    icon: null,
    addition: null,
    additionClassName: '',
    additionPosition: '',
    onChange: () => {},
    onAdditionClick: () => {},
    showErrorMessage: true,
  };

  render() {
    const {
      name,
      value,
      onChange,
      error,
      disabled,
      isFocused,
      className,
      label,
      icon,
      addition,
      labelTooltip,
      additionClassName,
      additionPosition,
      onAdditionClick,
      showErrorMessage,
      ...input
    } = this.props;

    const inputProps = {
      className: 'input__control',
      name,
      value,
      disabled,
      onChange,
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
              className={classNames(additionClassName, 'input__addition', {
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
