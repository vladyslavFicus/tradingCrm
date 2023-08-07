import React from 'react';
import { SidebarMenuItem } from 'config';
import useSidebarNav from 'components/Sidebar/hooks/useSidebarNav';
import SidebarNavItem from '../SidebarNavItem';
import './SidebarNav.scss';

type Props = {
  items: Array<SidebarMenuItem>,
  isSidebarOpen: boolean,
};

const SidebarNav = (props: Props) => {
  const { items, isSidebarOpen } = props;

  const { getItemsFilteredByPermissions } = useSidebarNav();

  return (
    <ul className="SidebarNav">
      {getItemsFilteredByPermissions(items).map((item: SidebarMenuItem) => (
        <If condition={!(item.items && !item.items.length)}>
          <SidebarNavItem
            {...item}
            isSidebarOpen={isSidebarOpen}
            key={item.label}
          />
        </If>
      ))}
    </ul>
  );
};

export default React.memo(SidebarNav);
