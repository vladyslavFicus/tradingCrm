import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Checkbox.scss';

class Checkbox extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    value: false,
    className: '',
    error: null,
    onChange: () => {},
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
    } = this.props;

    return (
      <div
        className={
          classNames(
            'Checkbox',
            {
              'Checkbox--has-error': !!error,
              'Checkbox--disabled': disabled,
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
          <span className="Checkbox__icon" />
          <span className="Checkbox__label">{label}</span>
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
