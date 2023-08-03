import React from 'react';
import classNames from 'classnames';
import useReactSwitch from '../hooks/useReactSwitch';
import './ReactSwitch.scss';

type LabelPosition = 'top' | 'bottom' | 'right' | 'left';

type Props = {
  on?: boolean,
  onClick: (on: boolean) => void,
  onError?: () => void,
  className?: string,
  disabled?: boolean,
  stopPropagation?: boolean,
  id?: string,
  label?: string,
  labelPosition?: LabelPosition,
};

const ReactSwitch = (props: Props) => {
  const {
    id,
    on = false,
    className,
    disabled = false,
    stopPropagation,
    onClick,
    onError,
    label,
    labelPosition = 'right',
  } = props;

  const { toggle, handleClick } = useReactSwitch({ on, stopPropagation, onClick, onError });

  return (
    <label className={classNames(
      'ReactSwitch',
      className,
      {
        'ReactSwitch--label-top': labelPosition === 'top',
        'ReactSwitch--label-bottom': labelPosition === 'bottom',
        'ReactSwitch--label-right': labelPosition === 'right',
        'ReactSwitch--label-left': labelPosition === 'left',
      },
    )}
    >
      <button
        type="button"
        disabled={disabled}
        className={classNames(
          'ReactSwitch__button',
          {
            'ReactSwitch__button--disabled': disabled,
            'ReactSwitch__button--on': toggle,
          },
        )}
        onClick={handleClick}
        id={id}
      >
        <div className="ReactSwitch__switch-toggle" />
      </button>

      <If condition={!!label}>
        <span className="ReactSwitch__label">{label}</span>
      </If>
    </label>
  );
};

export default React.memo(ReactSwitch);
