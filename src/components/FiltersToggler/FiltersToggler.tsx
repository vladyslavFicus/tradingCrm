import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { Button } from 'components/Buttons';
import EventEmitter, {
  FILTERS_TOGGLER_COLLAPSED,
  FILTERS_TOGGLER_IN_VIEWPORT,
} from 'utils/EventEmitter';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';
import './FiltersToggler.scss';

type Props = {
  children: React.ReactNode,
  className?: string,
  hideButton?: boolean,
  viewPortMarginTop?: number,
};

const FiltersToggler = (props: Props) => {
  const {
    children,
    className,
    hideButton,
    viewPortMarginTop = 0,
  } = props;

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
  const handleViewport = (inViewport: boolean) => {
    EventEmitter.emit(FILTERS_TOGGLER_IN_VIEWPORT, inViewport);
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={
        classNames('FiltersToggler', {
          'FiltersToggler--collapsed': collapsed,
          className,
        })
      }
    >
      <If condition={!hideButton}>
        <div className="FiltersToggler__actions">
          <Button
            tertiary
            className="FiltersToggler__button"
            onClick={handleCollapse}
          >
            <SwitcherIcon className="FiltersToggler__icon" />
          </Button>
        </div>
      </If>

      <If condition={!!children && !collapsed}>
        <InView
          onChange={handleViewport}
          rootMargin={`-${viewPortMarginTop}px 0px 0px 0px`}
        >
          {children}
        </InView>
      </If>
    </div>
  );
};

export default React.memo(FiltersToggler);
