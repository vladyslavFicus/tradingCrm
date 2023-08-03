import React from 'react';
import classNames from 'classnames';
import useFiltersTogglerButton from 'components/FiltersToggler/hooks/useFiltersTogglerButton';
import { ReactComponent as SwitcherIcon } from '../icons/switcher.svg';
import './FiltersTogglerButton.scss';

type Props = {
  className?: string,
};

const FiltersTogglerButton = (props: Props) => {
  const { className } = props;

  const {
    collapsed,
    handleCollapse,
  } = useFiltersTogglerButton();

  return (
    <div
      className={classNames(
        'FiltersTogglerButton',
        className,
        {
          'FiltersTogglerButton--collapsed': collapsed,
        },
      )}
      onClick={handleCollapse}
    >
      <SwitcherIcon className="FiltersTogglerButton__icon" />
    </div>
  );
};

export default React.memo(FiltersTogglerButton);
