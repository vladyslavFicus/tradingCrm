import React from 'react';
import { PermissionContext as ContextType } from 'types/permissions';
import Preloader from 'components/Preloader';
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

  const value = { permission: { permissions, allows, denies } };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const PermissionConsumer = PermissionContext.Consumer;

export default React.memo(PermissionProvider);
