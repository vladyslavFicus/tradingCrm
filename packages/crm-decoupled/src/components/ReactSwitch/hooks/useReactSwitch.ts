import React, { useEffect, useState } from 'react';
import I18n from 'i18n-js';
import { notify } from '@crm/common';
import { LevelType } from 'types';

type Props = {
  on?: boolean,
  onClick: (on: boolean) => void,
  onError?: () => void,
  stopPropagation?: boolean,
};

const useReactSwitch = (props: Props) => {
  const {
    on = false,
    stopPropagation,
    onClick,
    onError,
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
      setToggle(prevToggle => !prevToggle);

      if (onError) {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('COMMON.FAIL'),
        });
      }
    }
  };

  return {
    toggle,
    handleClick,
  };
};

export default useReactSwitch;
