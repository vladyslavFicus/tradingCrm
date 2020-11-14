const { ApolloLink } = require('apollo-link');
const { SubscriptionClient } = require('subscriptions-transport-ws-ack');

/**
 * WebSocket link implementation to usage custom `subscriptions-transport-ws-ack` package
 * subscriptions-transport-ws-ack build with custom branch and contain a fix with acknowledgement
 * that do a subscription only after connection acknowledgement received to client side.
 *
 * In original subscriptions-transport-ws library all subscription doing after the connection event and don't
 * re-subscribe if something with connection (for example bad token or websocket service doesn't answer)
 */
class WebSocketLink extends ApolloLink {
  constructor(paramsOrClient) {
    super();

    if (paramsOrClient instanceof SubscriptionClient) {
      this.subscriptionClient = paramsOrClient;
    } else {
      this.subscriptionClient = new SubscriptionClient(
        paramsOrClient.uri,
        paramsOrClient.options,
        paramsOrClient.webSocketImpl,
      );
    }
  }

  request(operation) {
    return this.subscriptionClient.request(operation);
  }
}

export default WebSocketLink;
