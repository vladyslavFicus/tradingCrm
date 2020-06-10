import { setHeaders } from './utils';

class Queue {
  constructor() {
    this.queue = [];
  }

  push({ operation, forward, observer }) {
    const request = {
      operation,
      forward,
      observer,
    };

    this.queue.push(request);
  }

  consume(token) {
    this.queue.forEach(({ forward, operation, observer }) => {
      setHeaders(operation, { authorization: `Bearer ${token}` });

      forward(operation).subscribe(observer);
    });

    this.queue = [];
  }

  clean() {
    this.queue = [];
  }
}

export default Queue;
