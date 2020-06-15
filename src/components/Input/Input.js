import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './input.scss';

class Input extends PureComponent {
  static propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onChange: PropTypes.func.isRequired,
    }).isRequired,
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
  };

  static defaultProps = {
    error: null,
    disabled: false,
    className: '',
    label: '',
    icon: null,
    addition: null,
    onAdditionClick: () => {},
  };

  render() {
    const {
      field: {
        value = '',
        ...field
      },
      error,
      disabled,
      className,
      label,
      icon,
      addition,
      onAdditionClick,
      ...input
    } = this.props;

    const inputProps = {
      ...input,
      ...field,
      disabled,
      className: 'input__control',
    };

    return (
      <div
        className={classNames('input', className, {
          'input--has-icon': icon,
          'input--has-error': error,
          'input--is-disabled': disabled,
          'input--has-addition': addition,
        })}
      >
        <div className="input__body">
          <If condition={label}>
            <label className="input__label">{label}</label>
          </If>
          <input value={value} {...inputProps} />
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
      </div>
    );
  }
}

export default Input;
