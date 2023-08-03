import { useCallback } from 'react';
import { SidebarMenuItem, SidebarMenuSubItem } from 'config/menu';
import { usePermission } from 'providers/PermissionsProvider';

const useSidebarNav = () => {
  const permission = usePermission();

  const checkItemOnPermissions = useCallback((item: SidebarMenuItem | SidebarMenuSubItem) => {
    if (item?.conditions === 'OR') {
      return !item.permissions || permission.allowsAny(item.permissions);
    }

    return !item.permissions || permission.allowsAll(item.permissions);
  }, [permission]);

  const getItemsFilteredByPermissions = useCallback((menuItems: Array<SidebarMenuItem>) => menuItems
    .filter((item: SidebarMenuItem) => checkItemOnPermissions(item))
    .map((item: SidebarMenuItem) => (
      item.items
        ? {
          ...item,
          items: item.items.filter((innerItem: SidebarMenuSubItem) => checkItemOnPermissions(innerItem)),
        }
        : item
    )), [checkItemOnPermissions]);

  return {
    getItemsFilteredByPermissions,
  };
};

export default useSidebarNav;
