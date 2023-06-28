import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import StaticTabsItem, { Props as StaticTabsItemProps } from './StaticTabsItem/StaticTabsItem';
import './StaticTabs.scss';

type Props = {
  children: React.ReactNode,
  navClassName?: string,
  navItemClassName?: string,
  navActiveItemClassName?: string,
  contentClassName?: string,
  onTabChanged?: () => void,
  hideIfOne?: boolean, // Hide tab button if only one tab provided
};

const StaticTabs = (props: Props) => {
  const {
    children,
    navClassName = '',
    navItemClassName = '',
    navActiveItemClassName = '',
    contentClassName = '',
    onTabChanged = () => {},
    hideIfOne,
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChanged = (_activeIndex: number) => {
    // Notify parent when tab changed
    if (activeIndex !== _activeIndex) {
      onTabChanged();
    }

    setActiveIndex(_activeIndex);
  };

  const _children = React.Children
    .toArray(children)
    .filter(child => (
      React.isValidElement(child)
      && child?.type === StaticTabsItem
    )) as Array<React.ReactElement<StaticTabsItemProps>>;

  return (
    <div className="StaticTabs">
      {/* Show tab buttons only if hideIfOne flag not provided */}
      <If condition={!(hideIfOne && _children.length === 1)}>
        <div className={classNames('StaticTabs__nav', navClassName)}>
          {_children.map(({ props: { label, ...rest } }, index) => (
            <Button
              key={index}
              data-testid="StaticTabs-button"
              className={classNames('StaticTabs__nav-item', navItemClassName, {
                'StaticTabs__nav-item--active': activeIndex === index,
                [navActiveItemClassName]: activeIndex === index,
              })}
              onClick={() => handleTabChanged(index)}
              {...rest}
            >
              {label}
            </Button>
          ))}
        </div>
      </If>

      <div className={classNames('StaticTabs__content', contentClassName)}>
        {_children.filter((_, index) => activeIndex === index)}
      </div>
    </div>
  );
};

export default React.memo(StaticTabs);
