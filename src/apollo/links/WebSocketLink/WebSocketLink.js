import { ApolloLink, Observable } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws-ack';

/**
 * WebSocket link implementation to usage custom `subscriptions-transport-ws-ack` package
 * subscriptions-transport-ws-ack build with custom branch and contain a fix with acknowledgement
 * that do a subscription only after connection acknowledgement received to client side.
 *
 * In original subscriptions-transport-ws library all subscription doing after the connection event and don't
 * re-subscribe if something with connection (for example bad token or websocket service doesn't answer)
 */
class WebSocketLink extends ApolloLink {
  constructor({ uri, options }) {
    super();

    this.observer = null;

    this.subscriptionClient = new SubscriptionClient(
      uri,
      {
        ...options,
        connectionCallback: this.connectionCallback,
      },
    );
  }

  /**
   * Send code UNAUTHENTICATED if socket receive UNAUTHENTICATED error on connection
   *
   * @param error
   */
  connectionCallback = (error) => {
    if (error?.message === 'UNAUTHENTICATED' && this.observer) {
      this.observer.next({ errors: [{ extensions: { code: 'UNAUTHENTICATED' } }] });
    }
  };

  request(operation) {
    return new Observable((observer) => {
      this.observer = observer;

      this.subscriptionClient.request(operation).subscribe(observer);
    });
  }
}

export default WebSocketLink;
