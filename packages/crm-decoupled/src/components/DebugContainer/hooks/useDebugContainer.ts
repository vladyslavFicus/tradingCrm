import { useStorageState } from '@crm/common';

const useDebugContainer = () => {
  // ===== Storage ===== //
  const [debug] = useStorageState<boolean>('debug');

  return { debug };
};

export default useDebugContainer;
