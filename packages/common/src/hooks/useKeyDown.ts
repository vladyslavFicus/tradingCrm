import { useEffect } from 'react';
/**
 * Handle key down event
 *
 * @param cb Callback which will be invoked each time when keydown event appears
 * @param dependencies Additional array of dependencies to re-create useEffect callback
 */
const useKeyDown = (
  cb: (e: KeyboardEvent) => void,
  dependencies: Array<any> = [],
) => {
  useEffect(() => {
    let isMounted = true;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Execute callback only if hook still mounted
      if (isMounted) {
        cb(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    // Remove keydown listener when hook will unmount
    return () => {
      isMounted = false;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, dependencies);
};

export default useKeyDown;
