import React, { useState, useEffect } from 'react';
import { getBrand, getVersion, setBrand } from 'config';
import IndexRoute from 'routes/IndexRoute';
import UpdateVersionError from 'components/UpdateVersionError';
import { useStorage } from 'providers/StorageProvider';

const App = () => {
  const [isUpdateVersionError, setIsUpdateVersionError] = useState(false);

  const currenBrand = getBrand();
  const version = getVersion();

  // ===== Storage ===== //
  const storage = useStorage();
  const brand = storage.get('brand');
  const auth = storage.get('auth');
  const clientVersion = storage.get('clientVersion');

  if (currenBrand?.id !== brand?.id) {
    setBrand(brand?.id);
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
