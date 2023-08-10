import { useState, useEffect, useMemo, useCallback } from 'react';
import useStorage from './useStorage';

type ReturnTuple<T> = [
  value: T,
  set: (value: T) => void,
  remove: () => void,
];

/**
 * Get state from storage depends on subscribed keys
 *
 * @param key
 */
const useStorageState = <T>(key: string): ReturnTuple<T> => {
  const storage = useStorage();

  // We need to get current actual value from storage for each render
  const value = storage.get(key);

  // *** NEED to update subscribed component when value changed in the storage *** //
  const [, setValue] = useState<T>(value);

  // Subscribe on changes by key
  useEffect(() => {
    storage.subscribe(key, setValue);

    return () => {
      storage.unsubscribe(key, setValue);
    };
  }, [key, storage]);

  // Memoize function to avoid re-create
  const set = useCallback((_value: any) => storage.set(key, _value), [storage, key]);
  const remove = useCallback(() => storage.remove(key), [storage, key]);

  // Return memoized result with value, set and remove methods
  return useMemo<ReturnTuple<T>>(() => [value, set, remove], [value, set, remove]);
};

export default useStorageState;
