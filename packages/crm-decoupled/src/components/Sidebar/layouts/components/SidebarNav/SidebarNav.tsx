import React from 'react';
import { Config } from '@crm/common';
import useSidebarNav from 'components/Sidebar/hooks/useSidebarNav';
import SidebarNavItem from '../SidebarNavItem';
import './SidebarNav.scss';

type Props = {
  items: Array<Config.SidebarMenuItem>,
  isSidebarOpen: boolean,
};

const SidebarNav = (props: Props) => {
  const { items, isSidebarOpen } = props;

  const { getItemsFilteredByPermissions } = useSidebarNav();

  return (
    <ul className="SidebarNav">
      {getItemsFilteredByPermissions(items).map((item: Config.SidebarMenuItem) => (
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
