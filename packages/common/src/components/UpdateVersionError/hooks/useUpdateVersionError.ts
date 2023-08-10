import { useCallback } from 'react';
import { useStorage } from '../../../providers/StorageProvider';

type Props = {
  newVersion?: string,
};

const useUpdateVersionError = (props: Props) => {
  const { newVersion } = props;

  // ===== Storage ===== //
  const storage = useStorage();

  // ===== Handlers ===== //
  const handleClearCacheData = useCallback(() => {
    caches.keys().then((names) => {
      names.forEach(name => caches.delete(name));
    });

    if (newVersion) {
      storage.set('clientVersion', newVersion);
    }

    window.location.reload();
  }, [newVersion]);

  return {
    handleClearCacheData,
  };
};

export default useUpdateVersionError;
