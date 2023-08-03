import React, { useCallback, useMemo, useState } from 'react';
import StaticTabsItem from '../../StaticTabsItem';
import { Props as StaticTabsItemProps } from '../../StaticTabsItem/types';

type Props = {
  children: React.ReactNode,
  onTabChanged?: () => void,
};

const useStaticTabs = (props: Props) => {
  const {
    children,
    onTabChanged = () => {},
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChanged = useCallback((_activeIndex: number) => {
    // Notify parent when tab changed
    if (activeIndex !== _activeIndex) {
      onTabChanged();
    }

    setActiveIndex(_activeIndex);
  }, [activeIndex, onTabChanged]);

  const _children = useMemo(() => React.Children
    .toArray(children)
    .filter(child => (
      React.isValidElement(child)
        && child?.type === StaticTabsItem
    )) as Array<React.ReactElement<StaticTabsItemProps>>,
  [children]);

  return {
    activeIndex,
    handleTabChanged,
    _children,
  };
};

export default useStaticTabs;
