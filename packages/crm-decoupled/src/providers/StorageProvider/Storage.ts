import storage from './storages/LocalStorage';

class Storage {
  private state: Record<string, any> = {};

  private subscribers: Record<string, Array<(value: any) => void> | undefined> = {};

  constructor() {
    this.load();
    this.onDataChange();
  }

  // ========== PRIVATE API ========== //
  /**
   * Load initial state from persisted storage
   *
   * @private
   */
  private load() {
    this.state = storage.load();
  }

  /**
   * Save current state to persistent storage
   *
   * @private
   */
  private persist() {
    storage.save(this.state);
  }

  /**
   * Subscribe to changes from persisted storage
   *
   * @private
   */
  private onDataChange() {
    storage.onDataChange((state) => {
      const prevState = { ...this.state };

      this.state = state;

      // Track changed values and notify subscribers about changes
      const allKeys = new Set([...Object.keys(prevState), ...Object.keys(state)]);

      allKeys.forEach((key) => {
        if (prevState[key] !== state[key]) {
          this.notify(key);
        }
      });
    });
  }

  /**
   * Notify all subscribers about changed value by key
   *
   * @param key
   *
   * @private
   */
  private notify(key: string) {
    this.subscribers[key]?.forEach(cb => cb(this.state[key]));
  }

  // ========== PUBLIC API ========== //
  /**
   * Get value by key
   *
   * @param key
   *
   * @return string
   */
  public get(key: string): any {
    return this.state[key];
  }

  /**
   * Set value by key
   *
   * @param key
   * @param value
   */
  public set(key: string, value: any): void {
    this.state[key] = value;

    this.notify(key);

    this.persist();
  }

  /**
   * Remove value by key
   *
   * @param key
   */
  public remove(key: string): void {
    this.state[key] = undefined;

    this.notify(key);

    this.persist();
  }

  /**
   * Subscribe to value changes by key
   *
   * @param key
   * @param cb
   */
  public subscribe(key: string, cb: (value: any) => void) {
    if (!this.subscribers[key]) {
      this.subscribers[key] = [];
    }

    this.subscribers[key]?.push(cb);
  }

  /**
   * Unsubscribe from value changes by key
   *
   * @param key
   * @param cb
   */
  public unsubscribe(key: string, cb: (value: any) => void) {
    const subscribers = this.subscribers[key];

    if (subscribers) {
      const index = subscribers.findIndex(subscriber => subscriber === cb);

      delete subscribers[index];
    }
  }
}

export default new Storage();
