import { useCallback, useEffect, useState } from 'react';
import { Utils } from '@crm/common';

type UseFiltersTogglerButton = {
  collapsed: boolean,
  handleCollapse: () => void,
};

const useFiltersTogglerButton = (): UseFiltersTogglerButton => {
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
    Utils.EventEmitter.on(Utils.FILTERS_TOGGLER_IN_VIEWPORT, onFiltersToggleInViewport);

    return () => {
      Utils.EventEmitter.off(Utils.FILTERS_TOGGLER_IN_VIEWPORT, onFiltersToggleInViewport);
    };
  }, []);

  /**
   * Handle filters toggler button click
   */
  const handleCollapse = useCallback(() => {
    setCollapsed(!collapsed);

    if (collapsed) {
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
    }

    Utils.EventEmitter.emit(Utils.FILTERS_TOGGLER_COLLAPSED, !collapsed);
  }, [collapsed]);

  return {
    collapsed,
    handleCollapse,
  };
};

export default useFiltersTogglerButton;
