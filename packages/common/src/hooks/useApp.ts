import { useState, useEffect } from 'react';
import { getBrand, setBrand, getVersion } from '../config';
import { useStorage } from '../providers';

type UseApp = {
  isUpdateVersionError: boolean,
  version: string,
  authDepartment?: string,
  brandId?: string,
}

const useApp = (): UseApp => {
  const [isUpdateVersionError, setIsUpdateVersionError] = useState<boolean>(false);

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

  return {
    isUpdateVersionError,
    version,
    authDepartment: auth?.department,
    brandId: brand?.id,
  };
};

export default useApp;
