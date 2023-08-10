import { Config, useStorageState, Brand, usePermission } from '@crm/common';
import { Widget } from 'types/config';
import { Permission } from 'types/permissions';

type UseDashboard = {
  id: string,
  permission: Permission,
  widgets: Array<Widget>,
};

const useDashboard = (): UseDashboard => {
  const [{ id }] = useStorageState<Brand>('brand');

  const permission = usePermission();
  const widgets = Config.getBackofficeBrand()?.dashboard?.widgets || [];

  return {
    id,
    permission,
    widgets,
  };
};

export default useDashboard;
