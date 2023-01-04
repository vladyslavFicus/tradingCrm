import React from 'react';
import { Permission } from 'types/permissions';
import { PermissionConsumer } from './PermissionProvider';

type Props = Record<string, any> & {permission?: Permission};

const withPermission = (Component: React.ComponentClass<Props>) => (
  (props: Record<string, any>) => (
    <PermissionConsumer>
      {({ permission }) => (
        <Component {...props} permission={permission} />
      )}
    </PermissionConsumer>
  )
);

export default withPermission;
