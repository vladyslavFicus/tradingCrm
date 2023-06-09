import { useRef } from 'react';

const EXPIRATION_TIME_PROP_KEY = '_autoLogoutTime';
const DEBOUNCE_MILLISECONDS = 300;
const EVENT_NAMES = ['mousemove', 'scroll', 'keydown'];

function useIdleTimer(storage: Storage, onTimeout: (timeout: number) => void) {
  const idleInterval = useRef<NodeJS.Timer | null>(null);
  const timeoutTracker = useRef<NodeJS.Timeout | null>(null);
  const timeout = useRef<number>(0);

  const clearTimeoutTracker = () => {
    if (timeoutTracker.current) {
      clearTimeout(timeoutTracker.current);
    }
  };

  const clearIdleInterval = () => {
    if (idleInterval.current) {
      clearInterval(idleInterval.current);
    }
  };

  const updateExpiredTime = () => {
    clearTimeoutTracker();

    if (timeout) {
      timeoutTracker.current = setTimeout(() => {
        storage.set(EXPIRATION_TIME_PROP_KEY, Date.now() + timeout.current * 1000);
      }, DEBOUNCE_MILLISECONDS);
    }
  };

  const cleanUp = () => {
    storage.remove(EXPIRATION_TIME_PROP_KEY);

    clearTimeoutTracker();
    clearIdleInterval();

    EVENT_NAMES.forEach(event => window.removeEventListener(event, updateExpiredTime));
  };

  const start = (_timeout: number) => {
    timeout.current = _timeout;
    cleanUp();

    updateExpiredTime();

    EVENT_NAMES.forEach(event => window.addEventListener(event, updateExpiredTime));

    idleInterval.current = setInterval(() => {
      const expirationTime = parseInt(storage.get(EXPIRATION_TIME_PROP_KEY) || '0', 10);
      if (expirationTime && expirationTime < Date.now()) {
        cleanUp();
        onTimeout(_timeout);
      }
    }, 1000);
  };

  return [start, cleanUp];
}

export default useIdleTimer;
