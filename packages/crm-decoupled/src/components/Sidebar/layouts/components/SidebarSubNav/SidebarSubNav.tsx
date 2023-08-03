import React from 'react';
import { SidebarMenuSubItem } from 'config/menu';
import useSidebarSubNav from 'components/Sidebar/hooks/useSidebarSubNav';
import SubNavItem from '../SubNavItem';
import './SidebarSubNav.scss';

type Props = {
  items?: Array<SidebarMenuSubItem>,
  isOpen: boolean,
};

const SidebarSubNav = (props: Props) => {
  const { items = [], isOpen } = props;

  const {
    subNavRef,
    height,
  } = useSidebarSubNav(isOpen);

  return (
    <div ref={subNavRef} style={{ height }} className="SidebarSubNav">
      {items.map((item: SidebarMenuSubItem) => (
        <SubNavItem
          key={item.label}
          label={item.label}
          url={item?.url || ''}
        />
      ))}
    </div>
  );
};

export default React.memo(SidebarSubNav);
