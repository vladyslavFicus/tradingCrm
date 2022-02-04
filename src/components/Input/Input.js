import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 } from 'uuid';
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
    autoFocus: PropTypes.bool,
    onTruncated: PropTypes.func,
    onEnterPress: PropTypes.func,
    showWarningMessage: PropTypes.bool,
    warningMessage: PropTypes.string,
    type: PropTypes.string,
    classNameError: PropTypes.string,
    onKeyDown: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    disabled: false,
    isFocused: false,
    className: '',
    label: '',
    labelTooltip: '',
    warningMessage: '',
    value: '',
    icon: null,
    addition: null,
    additionClassName: '',
    additionPosition: '',
    onChange: () => {},
    onAdditionClick: () => {},
    showErrorMessage: true,
    showWarningMessage: false,
    autoFocus: false,
    onEnterPress: () => true,
    onTruncated: () => {},
    type: 'text',
    classNameError: null,
    onKeyDown: () => {},
  };

  id = `input-${v4()}`;

  inputRef = React.createRef();

  componentDidMount() {
    // Enable autofocus on next tick (because in the same tick it isn't working)
    if (this.props.autoFocus) {
      setTimeout(() => this.inputRef.current.focus(), 0);
    }
  }

  /**
   * On key down handler
   *
   * @param e
   */
  onKeyDown = (e) => {
    const { target: { value }, code } = e;
    const { onTruncated, onEnterPress, onKeyDown } = this.props;

    // Fire onTruncated event if input value empty
    if (code === 'Backspace' && onTruncated && value.length === 0) {
      onTruncated();
    }
    if (code === 'Enter') {
      onEnterPress(this);
    }

    onKeyDown(e);
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
      warningMessage,
      showWarningMessage,
      additionClassName,
      additionPosition,
      onAdditionClick,
      showErrorMessage,
      onEnterPress,
      onTruncated,
      classNameError,
      ...input
    } = this.props;

    const inputProps = {
      className: 'input__control',
      name,
      value,
      disabled,
      onChange,
      ...input,
      ref: this.inputRef,
      onKeyDown: this.onKeyDown,
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
          <label className="input__label" htmlFor={this.id}>{label}</label>
          <If condition={labelTooltip}>
            <span id={uniqueId} className="input__label-icon">
              <i className="input__icon-info fa fa-info-circle" />
            </span>
            <UncontrolledTooltip
              fade={false}
              target={uniqueId}
            >
              {labelTooltip}
            </UncontrolledTooltip>
          </If>
        </If>
        <div className="input__body">
          <If condition={showWarningMessage}>
            <UncontrolledTooltip
              target={this.id}
              fade={false}
              isOpenDefault
            >
              {warningMessage}
            </UncontrolledTooltip>
          </If>
          <input
            {...inputProps}
            id={this.id}
            onWheel={e => e.target.blur()}
          />
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
            <div className={classNames('input__error', classNameError)}>
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
