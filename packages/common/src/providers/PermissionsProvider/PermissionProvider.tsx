import React from 'react';
import { PermissionContext as ContextType } from '../../types/permissions';
import { Preloader } from '../../components';
import { usePermissionsQuery } from './graphql/__generated__/PermissionsQuery';

export const PermissionContext = React.createContext({} as ContextType);

type Props = {
  children: React.ReactNode,
};

const PermissionProvider = (props: Props) => {
  const { children } = props;

  const { data, loading } = usePermissionsQuery();

  if (loading && !data?.permission) {
    return <Preloader />;
  }

  const permissions = data?.permission as Array<string> || [];

  const allows = (action: string): boolean => permissions.includes(action);

  const denies = (action: string): boolean => !allows(action);

  const allowsAll = (actions: Array<string>): boolean => actions.every(allows);

  const allowsAny = (actions: Array<string>): boolean => actions.some(allows);

  const value = { permission: { permissions, allows, denies, allowsAll, allowsAny } };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export default React.memo(PermissionProvider);
