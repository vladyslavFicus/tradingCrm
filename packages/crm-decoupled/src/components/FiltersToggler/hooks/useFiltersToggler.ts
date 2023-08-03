import { useCallback, useEffect, useState } from 'react';
import EventEmitter, {
  FILTERS_TOGGLER_COLLAPSED,
  FILTERS_TOGGLER_IN_VIEWPORT,
} from 'utils/EventEmitter';

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
    EventEmitter.on(FILTERS_TOGGLER_COLLAPSED, onFiltersTogglerCollapsed);

    return () => {
      EventEmitter.off(FILTERS_TOGGLER_COLLAPSED, onFiltersTogglerCollapsed);
    };
  }, []);

  /**
   * Listener when filters toggler content changed state in viewport
   *
   * @param inViewport
   */
  const handleViewport = useCallback((inViewport: boolean) => {
    EventEmitter.emit(FILTERS_TOGGLER_IN_VIEWPORT, inViewport);
  }, []);

  const handleCollapse = useCallback(() => setCollapsed(prevCollapsed => !prevCollapsed), []);

  return {
    collapsed,
    handleViewport,
    handleCollapse,
  };
};

export default useFiltersToggler;
