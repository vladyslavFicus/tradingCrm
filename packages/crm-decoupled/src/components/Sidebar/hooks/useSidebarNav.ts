import { useCallback } from 'react';
import { Config, usePermission } from '@crm/common';

const useSidebarNav = () => {
  const permission = usePermission();

  const checkItemOnPermissions = useCallback((item: Config.SidebarMenuItem | Config.SidebarMenuSubItem) => {
    if (item?.conditions === 'OR') {
      return !item.permissions || permission.allowsAny(item.permissions);
    }

    return !item.permissions || permission.allowsAll(item.permissions);
  }, [permission]);

  const getItemsFilteredByPermissions = useCallback((menuItems: Array<Config.SidebarMenuItem>) => menuItems
    .filter((item: Config.SidebarMenuItem) => checkItemOnPermissions(item))
    .map((item: Config.SidebarMenuItem) => (
      item.items
        ? {
          ...item,
          items: item.items.filter((innerItem: Config.SidebarMenuSubItem) => checkItemOnPermissions(innerItem)),
        }
        : item
    )), [checkItemOnPermissions]);

  return {
    getItemsFilteredByPermissions,
  };
};

export default useSidebarNav;
