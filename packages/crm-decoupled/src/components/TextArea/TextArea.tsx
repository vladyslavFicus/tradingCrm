import React from 'react';
import classNames from 'classnames';
import { v4 } from 'uuid';
import './TextArea.scss';

type Resize = 'none' | 'both' | 'horizontal' | 'vertical';

type Props = {
  name: string,
  value?: string,
  error?: string | boolean | [string],
  disabled?: boolean,
  className?: string,
  label: string | React.ReactElement,
  labelClassName?: string,
  showErrorMessage?: boolean,
  placeholder?: string,
  maxLength?: number,
  helpText?: React.ReactNode,
  resize?: Resize,
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
}

const TextArea = (props: Props) => {
  const {
    name,
    value,
    disabled,
    onChange,
    placeholder,
    showErrorMessage = true,
    labelClassName,
    className,
    helpText,
    resize = 'none',
    label,
    maxLength,
    error,
    ...textarea
  } = props;

  const id = `textarea-${v4()}`;

  return (
    <div className={
      classNames(
        'TextArea',
        className,
        {
          'TextArea--error': error,
        },
      )
    }
    >

      <If condition={!!label}>
        <label
          className={
            classNames(
              'TextArea__label',
              labelClassName,
            )
          }
          htmlFor={id}
        >
          {label}
        </label>
      </If>

      <textarea
        className={classNames(
          'TextArea__textarea',
          `TextArea__textarea-resize--${resize}`,
          {
            'TextArea__textarea--disabled': disabled,
            'TextArea__textarea--error': error && showErrorMessage,
          },
        )}
        id={id}
        name={name}
        disabled={disabled}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value !== null ? value : ''}
        {...textarea}
      />

      <If condition={!!(error && showErrorMessage)}>
        <div className="TextArea__error-wrapper">
          <i className="TextArea__error-icon icon-alert" />
          {error}
        </div>
      </If>

      <If condition={!!helpText}>
        <div className="TextArea__help">
          {helpText}
        </div>
      </If>
    </div>
  );
};

export default React.memo(TextArea);
