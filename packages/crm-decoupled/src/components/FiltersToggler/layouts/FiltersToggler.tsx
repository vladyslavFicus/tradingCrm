import React from 'react';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { Button } from 'components';
import useFiltersToggler from 'components/FiltersToggler/hooks/useFiltersToggler';
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

  const {
    collapsed,
    handleViewport,
    handleCollapse,
  } = useFiltersToggler();

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
