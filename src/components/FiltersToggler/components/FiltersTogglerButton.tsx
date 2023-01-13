import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import EventEmitter, {
  FILTERS_TOGGLER_COLLAPSED,
  FILTERS_TOGGLER_IN_VIEWPORT,
} from 'utils/EventEmitter';
import { ReactComponent as SwitcherIcon } from '../icons/switcher.svg';
import './FiltersTogglerButton.scss';

type Props = {
  className?: string,
};

const FiltersTogglerButton = (props: Props) => {
  const { className } = props;

  const [collapsed, setCollapsed] = useState<boolean>(false);

  /**
 * Listener when filters toggler changed state in viewport
 *
 * @param inViewport
 */
  const onFiltersToggleInViewport = (inViewport: boolean) => {
    setCollapsed(!inViewport);
  };


  useEffect(() => {
    EventEmitter.on(FILTERS_TOGGLER_IN_VIEWPORT, onFiltersToggleInViewport);

    return () => {
      EventEmitter.off(FILTERS_TOGGLER_IN_VIEWPORT, onFiltersToggleInViewport);
    };
  }, []);

  /**
   * Handle filters toggler button click
   */
  const handleCollapse = () => {
    setCollapsed(!collapsed);

    if (collapsed) {
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
    }

    EventEmitter.emit(FILTERS_TOGGLER_COLLAPSED, !collapsed);
  };

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
