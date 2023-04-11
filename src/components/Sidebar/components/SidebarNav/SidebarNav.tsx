import React from 'react';
import { usePermission } from 'providers/PermissionsProvider';
import { SidebarMenuItem, SidebarMenuSubItem } from 'config/menu';
import SidebarNavItem from '../SidebarNavItem/index';
import './SidebarNav.scss';

type Props = {
  items: Array<SidebarMenuItem>,
  isSidebarOpen: boolean,
};

const SidebarNav = (props: Props) => {
  const {
    items,
    isSidebarOpen,
  } = props;

  const permission = usePermission();

  const checkItemOnPermissions = (item: SidebarMenuItem | SidebarMenuSubItem) => {
    if (item?.conditions === 'OR') {
      return !item.permissions || permission.allowsAny(item.permissions);
    }

    return !item.permissions || permission.allowsAll(item.permissions);
  };

  const getItemsFilteredByPermissions = (menuItems: Array<SidebarMenuItem>) => menuItems
    .filter((item: SidebarMenuItem) => checkItemOnPermissions(item))
    .map((item: SidebarMenuItem) => (
      item.items
        ? {
          ...item,
          items: item.items.filter((innerItem: SidebarMenuSubItem) => checkItemOnPermissions(innerItem)),
        }
        : item
    ));

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
