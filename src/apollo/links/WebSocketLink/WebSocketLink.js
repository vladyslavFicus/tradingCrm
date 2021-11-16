import { ApolloLink, Observable } from 'apollo-link';
import { print } from 'graphql';
import { createClient, CloseCode } from 'graphql-ws';

class WebSocketLink extends ApolloLink {
  constructor(options = {}) {
    super();

    this.observer = null;

    this.client = createClient({
      ...options,
      on: {
        ...options?.on,
        closed: (event) => {
          options?.on?.closed(event);

          /**
           * Send code UNAUTHENTICATED if socket receive Forbidden error on connection
           */
          if (event.code === CloseCode.Forbidden) {
            this.observer.next({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] });
          }
        },
      },
    });
  }

  request(operation) {
    return new Observable((observer) => {
      this.observer = observer;

      this.client.subscribe({ ...operation, query: print(operation.query) }, observer);
    });
  }
}

export default WebSocketLink;
