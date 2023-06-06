export const EXPIRATION_TIME_PROP_KEY = '_expiredTime';
const EVENT_NAMES = ['mousemove', 'scroll', 'keydown'];

class IdleTimer {
  constructor({ storage, timeout, onTimeout }) {
    this.storage = storage;
    this.timeout = timeout;
    this.onTimeout = onTimeout;

    this.eventHandler = this.updateExpiredTime.bind(this);
    this.startTracker();
    this.startInterval();
  }

  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const expirationTime = parseInt(this.storage.get(EXPIRATION_TIME_PROP_KEY) || '0', 10);
      if (expirationTime && expirationTime < Date.now()) {
        this.onTimeout(this.timeout);
        this.cleanUp();
      }
    }, 1000);
  }

  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      this.storage.set(EXPIRATION_TIME_PROP_KEY, Date.now() + this.timeout * 1000);
    }, 300);
  }

  startTracker() {
    EVENT_NAMES.forEach(event => window.addEventListener(event, this.eventHandler));
  }

  cleanUp() {
    this.storage.remove(EXPIRATION_TIME_PROP_KEY);
    clearInterval(this.interval);

    EVENT_NAMES.forEach(event => window.removeEventListener(event, this.eventHandler));
  }
}

export default IdleTimer;
