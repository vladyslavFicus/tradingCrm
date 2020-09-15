import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    className: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    addition: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onAdditionClick: PropTypes.func,
    showErrorMessage: PropTypes.bool,
  };

  static defaultProps = {
    error: null,
    disabled: false,
    className: '',
    label: '',
    value: '',
    icon: null,
    addition: null,
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
      className,
      label,
      icon,
      addition,
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

    return (
      <div
        className={classNames('input', className, {
          'input--has-icon': icon,
          'input--has-error': error && showErrorMessage,
          'input--is-disabled': disabled,
          'input--has-addition': addition,
        })}
      >
        <div className="input__body">
          <If condition={label}>
            <label className="input__label">{label}</label>
          </If>
          <input {...inputProps} />
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
