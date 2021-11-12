import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 } from 'uuid';
import { ReactComponent as CheckIcon } from './img/check-icon.svg';
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
    hint: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    value: false,
    className: '',
    label: null,
    error: null,
    hint: null,
    onChange: () => {},
    vertical: false,
  };

  id = v4();

  /**
   * Change value by press on space or enter button
   *
   * @param e
   */
  handleKeyPress = (e) => {
    e.preventDefault();

    if (['Space', 'Enter'].includes(e.code)) {
      this.props.onChange();
    }
  };

  render() {
    const {
      name,
      value,
      label,
      error,
      hint,
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
        <label className="Checkbox__container" htmlFor={this.id}>
          <input
            id={this.id}
            name={name}
            className="Checkbox__input"
            onChange={onChange}
            disabled={disabled}
            type="checkbox"
            checked={value}
          />
          <span
            className="Checkbox__icon"
            tabIndex={disabled ? -1 : 0} // eslint-disable-line
            onKeyPress={this.handleKeyPress}
          >
            <CheckIcon className="Checkbox__icon-in" />
          </span>
          <If condition={label}>
            <span className="Checkbox__label">{label}</span>
          </If>
        </label>
        <If condition={hint}>
          <div className="Checkbox__hint">
            <span>{hint}</span>
          </div>
        </If>
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
