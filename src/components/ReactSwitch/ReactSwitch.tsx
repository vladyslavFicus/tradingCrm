import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { LevelType } from 'types';
import { notify } from 'providers/NotificationProvider';
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

  const [toggle, setToggle] = useState<boolean>(on);

  useEffect(() => {
    setToggle(on);
  }, [on]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    const newValue = !toggle;
    setToggle(newValue);

    try {
      await onClick(newValue);
    } catch (_) {
      // Revert changes if error has occurred
      setToggle(!toggle);

      if (onError) {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('COMMON.FAIL'),
        });
      }
    }
  };

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
