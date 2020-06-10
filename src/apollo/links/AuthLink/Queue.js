import { setHeaders } from './utils';

/**
 * Queue with unauthorized operations
 */
class Queue {
  constructor() {
    this.queue = [];
  }

  /**
   * Add operation to queue
   *
   * @param operation
   * @param forward
   * @param observer
   */
  push({ operation, forward, observer }) {
    const request = {
      operation,
      forward,
      observer,
    };

    this.queue.push(request);
  }

  /**
   * Consume queue
   *
   * @param token New refreshed token
   */
  consume(token) {
    this.queue.forEach(({ forward, operation, observer }) => {
      // Set new refreshed token to operation
      setHeaders(operation, { authorization: `Bearer ${token}` });

      // Retry operation
      forward(operation).subscribe(observer);
    });

    this.queue = [];
  }

  /**
   * Clean queue
   */
  clean() {
    this.queue = [];
  }
}

export default Queue;
