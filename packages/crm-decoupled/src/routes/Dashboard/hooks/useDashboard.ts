import { Config, Types, useStorageState, Brand, usePermission } from '@crm/common';

type UseDashboard = {
  id: string,
  permission: Types.Permission,
  widgets: Array<Types.Widget>,
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
