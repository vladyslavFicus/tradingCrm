import { useEffect } from 'react';
/**
 * Handle element outside click
 *
 * @param cb Callback which will be invoked each time when outside click appears
 * @param element HTML element to detect outside click of it
 * @param dependencies Additional array of dependencies to re-create useEffect callback
 */
const useOutsideClick = (
  cb: (e: MouseEvent) => void,
  element: HTMLElement | null,
  dependencies: Array<any> = [],
) => {
  useEffect(() => {
    let isMounted = true;
    const handleOutsideClick = (e: MouseEvent) => {
      // Execute callback only if hook still mounted
      if (isMounted && element?.contains(e.target as HTMLElement) === false) {
        cb(e);
      }
    };
    document.addEventListener('click', handleOutsideClick, true);
    // Remove outside click listener when hook will unmount
    return () => {
      isMounted = false;
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [element, ...dependencies]);
};

export default useOutsideClick;
