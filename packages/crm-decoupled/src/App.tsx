import React, { useState, useEffect } from 'react';
import { Config, useStorage } from '@crm/common';
import { UpdateVersionError } from 'components';
import IndexRoute from 'routes/IndexRoute';

const App = () => {
  const [isUpdateVersionError, setIsUpdateVersionError] = useState(false);

  const currenBrand = Config.getBrand();
  const version = Config.getVersion();

  // ===== Storage ===== //
  const storage = useStorage();
  const brand = storage.get('brand');
  const auth = storage.get('auth');
  const clientVersion = storage.get('clientVersion');

  if (currenBrand?.id !== brand?.id) {
    Config.setBrand(brand?.id);
  }

  useEffect(() => {
    if (!clientVersion) {
      storage.set('clientVersion', version);
    } else if (clientVersion !== version) {
      setIsUpdateVersionError(true);
    }
  }, []);

  return (
    <>
      <If condition={isUpdateVersionError}>
        <UpdateVersionError newVersion={version} />
      </If>

      <IndexRoute key={document.hidden ? `${auth?.department}-${brand?.id}` : ''} />;
    </>
  );
};

export default React.memo(App);
