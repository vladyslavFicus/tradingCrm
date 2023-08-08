import React from 'react';
import classNames from 'classnames';
import { useCheckbox } from '../../hooks';
import { ReactComponent as CheckIcon } from './img/check-icon.svg';
import './Checkbox.scss';

type Props = {
  label?: string,
  name: string,
  value?: boolean,
  className?: string,
  disabled?: boolean,
  error?: string,
  vertical?: boolean,
  hint?: string,
  onChange: () => void,
}

const Checkbox = (props: Props) => {
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
    ...rest
  } = props;

  const {
    id,
    handleKeyPress,
  } = useCheckbox({ onChange });

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
      <label className="Checkbox__container" htmlFor={id}>
        <input
          id={id}
          name={name}
          className="Checkbox__input"
          onChange={onChange}
          disabled={disabled}
          type="checkbox"
          checked={value}
          {...rest}
        />

        <span
          className="Checkbox__icon"
          tabIndex={disabled ? -1 : 0}
          onKeyPress={handleKeyPress}
        >
          <CheckIcon className="Checkbox__icon-in" />
        </span>

        <If condition={!!label}>
          <span className="Checkbox__label">{label}</span>
        </If>
      </label>

      <If condition={!!hint}>
        <div className="Checkbox__hint">
          <span>{hint}</span>
        </div>
      </If>

      <If condition={!!error}>
        <div className="Checkbox__error">
          <i className="icon icon-alert" />
          {error}
        </div>
      </If>
    </div>
  );
};

export default React.memo(Checkbox);
