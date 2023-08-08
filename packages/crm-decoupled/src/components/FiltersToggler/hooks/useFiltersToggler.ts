import { useCallback, useEffect, useState } from 'react';
import { Utils } from '@crm/common';

type UseFiltersToggler = {
  collapsed: boolean,
  handleViewport: (inViewport: boolean) => void,
  handleCollapse: () => void,
};

const useFiltersToggler = (): UseFiltersToggler => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  /**
 * Listener when collapse event was fired
 *
 * @param collapse
 */
  const onFiltersTogglerCollapsed = (collapse: boolean) => {
    setCollapsed(collapse);
  };

  useEffect(() => {
    Utils.EventEmitter.on(Utils.FILTERS_TOGGLER_COLLAPSED, onFiltersTogglerCollapsed);

    return () => {
      Utils.EventEmitter.off(Utils.FILTERS_TOGGLER_COLLAPSED, onFiltersTogglerCollapsed);
    };
  }, []);

  /**
   * Listener when filters toggler content changed state in viewport
   *
   * @param inViewport
   */
  const handleViewport = useCallback((inViewport: boolean) => {
    Utils.EventEmitter.emit(Utils.FILTERS_TOGGLER_IN_VIEWPORT, inViewport);
  }, []);

  const handleCollapse = useCallback(() => setCollapsed(prevCollapsed => !prevCollapsed), []);

  return {
    collapsed,
    handleViewport,
    handleCollapse,
  };
};

export default useFiltersToggler;
