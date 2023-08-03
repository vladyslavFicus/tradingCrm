import { useStorageState } from 'providers/StorageProvider';

const useDebugContainer = () => {
  // ===== Storage ===== //
  const [debug] = useStorageState<boolean>('debug');

  return { debug };
};

export default useDebugContainer;
