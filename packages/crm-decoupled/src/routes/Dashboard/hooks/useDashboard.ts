import { getBackofficeBrand } from 'config';
import { Permission } from 'types/permissions';
import { Widget } from 'types/config';
import { useStorageState, Brand } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';

type UseDashboard = {
  id: string,
  permission: Permission,
  widgets: Array<Widget>,
};

const useDashboard = (): UseDashboard => {
  const [{ id }] = useStorageState<Brand>('brand');

  const permission = usePermission();
  const widgets = getBackofficeBrand()?.dashboard?.widgets || [];

  return {
    id,
    permission,
    widgets,
  };
};

export default useDashboard;
