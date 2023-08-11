import { useStorageState } from '../../../providers';

const useDebugMode = () => {
  // ===== Storage ===== //
  const [debug, setDebug] = useStorageState<boolean>('debug');

  return { debug, setDebug };
};

export default useDebugMode;
