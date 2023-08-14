
import { usePermission } from '@crm/common';
import { ActionItem } from '../types';

type UseActionsDropDown = {
  visibleItems: Array<ActionItem>,
};

const useActionsDropDown = (items: Array<ActionItem>): UseActionsDropDown => {
  const permission = usePermission();

  const visibleItems = items.filter(item => !item.permission || permission.allows(item.permission));

  return {
    visibleItems,
  };
};

export default useActionsDropDown;
