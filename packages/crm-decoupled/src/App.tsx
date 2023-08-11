import React from 'react';
import { useApp } from '@crm/common';
import { UpdateVersionError } from 'components';
import IndexRoute from 'routes/IndexRoute';

const App = () => {
  const {
    isUpdateVersionError,
    version,
    authDepartment,
    brandId,
  } = useApp();

  return (
    <>
      <If condition={isUpdateVersionError}>
        <UpdateVersionError newVersion={version} />
      </If>

      <IndexRoute key={document.hidden ? `${authDepartment}-${brandId}` : ''} />;
    </>
  );
};

export default React.memo(App);
