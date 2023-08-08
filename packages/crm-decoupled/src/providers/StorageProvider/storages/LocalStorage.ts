import { Utils } from '@crm/common';

const STORAGE_KEY = '@storage';

/**
 * Storage implementation depends on local storage
 */
class LocalStorage {
  /**
   * Check if local storage is available
   *
   * @return {boolean}
   */
  isAvailable(): boolean {
    try {
      const test = 'test';

      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Load state from local storage
   *
   * @return {string}
   */
  load(): Record<string, any> {
    return Utils.parseJson(window.localStorage.getItem(STORAGE_KEY) || '');
  }

  /**
   * Save state object to local storage
   *
   * @param state Object with state to save
   */
  save(state: Record<string, any>) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /**
   * Listen storage event and execute callback for cross-tab
   *
   * @param cb Callback to execute with new state when data was changed
   */
  onDataChange(cb: (state: Record<string, any>) => void): void {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        const newValue = Utils.parseJson(e.newValue || '');
        const oldValue = Utils.parseJson(e.oldValue || '');

        // Set undefined to deleted key, because component will not update if key just removed from the state
        Object.keys(oldValue).forEach((key) => {
          if (!newValue[key]) {
            newValue[key] = undefined;
          }
        });

        cb(newValue);
      }
    });
  }
}

export default new LocalStorage();
