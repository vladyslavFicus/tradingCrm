import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as CheckIcon } from './check-icon.svg';
import './Checkbox.scss';

class Checkbox extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    onChange: PropTypes.func,
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    value: false,
    className: '',
    label: null,
    error: null,
    onChange: () => {},
    vertical: false,
  };

  render() {
    const {
      name,
      value,
      label,
      error,
      disabled,
      className,
      onChange,
      vertical,
    } = this.props;

    return (
      <div
        className={
          classNames(
            'Checkbox',
            {
              'Checkbox--has-error': !!error,
              'Checkbox--disabled': disabled,
              'Checkbox--vertical': vertical,
            },
            className,
          )
        }
      >
        <label className="Checkbox__container">
          <input
            name={name}
            className="Checkbox__input"
            onChange={onChange}
            disabled={disabled}
            type="checkbox"
            checked={value}
          />
          <span className="Checkbox__icon">
            <CheckIcon className="Checkbox__icon-in" />
          </span>
          <If condition={label}>
            <span className="Checkbox__label">{label}</span>
          </If>
        </label>
        <If condition={error}>
          <div className="Checkbox__error">
            <i className="icon icon-alert" />
            {error}
          </div>
        </If>
      </div>
    );
  }
}

export default Checkbox;
