import { useRef } from 'react';
import { useStorage, useStorageState } from '@crm/common';

/**
 * hook to use idle timer inside components
 *
 * It returns object UseIdleTimer consisting functions:
 *
 *  - start(timeout: number) (to start timer)
 *  - cleanUp to reset timer
 *
 * Example of usage:
 *
 *  const { start, cleanUp } = useIdleTimer({ storage, onTimeout: handleOnTimeout })
 *
 * @param requests {Props} Example: { storage: Storage, onTimeout: (timeout: number) => void }
 *
 * @return {start: (timeout: number) => void, cleanUp: () => void}
 */
const EXPIRATION_TIME_PROP_KEY = '_autoLogoutTime';
const DEBOUNCE_MILLISECONDS = 300;
const EVENT_NAMES = ['mousemove', 'scroll', 'keydown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'mousedown'];

type Props = {
  onTimeout: (timeout: number) => void,
}

type UseIdleTimer = {
  start: (timeout: number) => void,
  cleanUp: () => void,
}

function useIdleTimer(props: Props): UseIdleTimer {
  const { onTimeout } = props;
  const idleInterval = useRef<NodeJS.Timer | null>(null);
  const timeoutTracker = useRef<NodeJS.Timeout | null>(null);
  const storage = useStorage();
  const [, setExpirationTime, removeExpirationTime] = useStorageState<string>(EXPIRATION_TIME_PROP_KEY);

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

    if (timeout.current) {
      timeoutTracker.current = setTimeout(() => {
        setExpirationTime(`${Date.now() + timeout.current * 1000}`);
      }, DEBOUNCE_MILLISECONDS);
    }
  };

  const cleanUp = () => {
    removeExpirationTime();

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

  return { start, cleanUp };
}

export default useIdleTimer;
