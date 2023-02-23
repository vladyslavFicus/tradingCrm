import React, { useRef } from 'react';
import { SidebarMenuSubItem } from 'config/menu';
import SubNavItem from '../SubNavItem';
import './SidebarSubNav.scss';

type Props = {
  items?: Array<SidebarMenuSubItem>,
  isOpen: boolean,
};

const SidebarSubNav = (props: Props) => {
  const { items = [], isOpen } = props;

  const subNavRef = useRef(null);

  const scrollHeight = (subNavRef?.current as HTMLDivElement | null)?.scrollHeight;

  const height = isOpen && scrollHeight ? scrollHeight : 0;

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
