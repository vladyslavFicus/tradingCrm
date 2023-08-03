import React from 'react';
import classNames from 'classnames';
import { Button } from 'components/Buttons';
import useStaticTabs from '../hooks/useStaticTabs';
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

  const {
    activeIndex,
    handleTabChanged,
    _children,
  } = useStaticTabs({ children, onTabChanged });

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
