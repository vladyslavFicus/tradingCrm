import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { v4 } from 'uuid';
import { UncontrolledTooltip } from 'components';
import './Input.scss';

type Props = {
  name: string,
  autoFocus?: boolean,
  addition?: React.ReactNode,
  additionClassName?: string,
  additionPosition?: string,
  classNameError?: string,
  error?: string | boolean | string[],
  icon?: string,
  isFocused?: boolean,
  label?: string,
  labelTooltip?: string,
  showErrorMessage?: boolean,
  showWarningMessage?: boolean,
  warningMessage?: string,
  onAdditionClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
  onEnterPress?: () => Promise<void>,
  onTruncated?: () => void,
};

const Input = (props : Props & React.InputHTMLAttributes<HTMLInputElement>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(`input-${v4()}`);

  const {
    name,
    autoFocus,
    value = '',
    onChange,
    error,
    disabled = false,
    isFocused,
    className,
    classNameError,
    label,
    icon,
    addition,
    labelTooltip,
    warningMessage,
    additionClassName,
    additionPosition,
    showErrorMessage = true,
    showWarningMessage,
    onAdditionClick,
    onEnterPress,
    onTruncated,
    onKeyDown,
    ...rest
  } = props;

  useEffect(() => {
    // Enable autofocus on next tick (because in the same tick it isn't working)
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  /**
   * On key down handler
   *
   * @param e
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { currentTarget: { value: v }, code } = e;
    // Fire onTruncated event if input value empty
    if (code === 'Backspace' && typeof onTruncated === 'function' && v.length === 0) {
      onTruncated();
    }
    if (code === 'Enter' && onEnterPress) {
      onEnterPress();
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const onAdditionClickHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    if (onAdditionClick) {
      onAdditionClick(e);
    }
    inputRef.current?.focus();
  };

  const inputProps = {
    ...rest,
    className: 'Input__control',
    name,
    value,
    disabled,
    onChange,
    ref: inputRef,
    onKeyDown: handleKeyDown,
  };

  const tooltipId = `label-${name}`;

  return (
    <div
      className={classNames('Input', className, {
        'Input--has-icon': icon,
        'Input--has-error': error && showErrorMessage,
        'Input--is-disabled': disabled,
        'Input--has-addition': addition && additionPosition !== 'right',
        'Input--is-focused': isFocused,
      })}
    >
      <If condition={!!label}>
        <label className="Input__label" htmlFor={idRef.current}>{label}</label>

        <If condition={!!labelTooltip}>
          <span id={tooltipId} className="Input__label-icon">
            <i className="Input__icon-info fa fa-info-circle" />
          </span>

          <UncontrolledTooltip
            fade={false}
            target={tooltipId}
          >
            {labelTooltip}
          </UncontrolledTooltip>
        </If>
      </If>

      <div className="Input__body">
        <input
          {...inputProps}
          id={idRef.current}
          onWheel={e => (e.target as HTMLElement).blur()}
        />

        <If condition={!!icon}>
          <i className={classNames(icon, 'Input__icon')} />
        </If>

        <If condition={!!addition}>
          <div
            className={classNames(additionClassName, 'Input__addition', {
              'Input__addition--right': additionPosition === 'right',
            })}
            onClick={onAdditionClickHandler}
          >
            {addition}
          </div>
        </If>
      </div>

      <If condition={!!showWarningMessage}>
        <div className="Input__footer">
          <div className={classNames('Input__error')}>
            {warningMessage}
          </div>
        </div>
      </If>

      <If condition={!!error && !!showErrorMessage}>
        <div className="Input__footer">
          <div className={classNames('Input__error', classNameError)}>
            <i className="Input__error-icon icon-alert" />
            {error}
          </div>
        </div>
      </If>
    </div>
  );
};

export default React.memo(Input);
