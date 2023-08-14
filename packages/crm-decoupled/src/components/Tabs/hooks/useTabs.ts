import { useMemo } from 'react';
import { usePermission } from '@crm/common';

type Item = {
  label: string,
  url: string,
  permissions?: string,
};

type Props = {
  items: Array<Item>,
};

const useTabs = (props: Props) => {
  const {
    items,
  } = props;

  const permission = usePermission();

  const tabs = useMemo(() => items.filter(item => !item.permissions || permission.allows(item.permissions)),
    [items, permission]);

  return { tabs };
};

export default useTabs;
