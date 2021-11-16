import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { RSocketContext } from './RSocketProvider';

let _subscribers = [];

/**
 * Mock Provider for emulate RSocket connection and messages
 */
class RSocketMockedClient {
  _route = null;

  _payload = null;

  route(route) {
    this._route = route;

    return this;
  }

  requestStream(payload) {
    this._payload = payload;

    return this;
  }

  subscribe(subscriber) {
    subscriber.onSubscribe({
      request: () => {
        _subscribers.push({ route: this._route, payload: this._payload, subscriber });
      },
      cancel: () => {
        _subscribers = _subscribers.filter(item => item.subscriber !== subscriber);
      },
    });
  }

  cancel() {
    return null;
  }
}

class RSocketMockedProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  client = new RSocketMockedClient();

  render() {
    return (
      <RSocketContext.Provider value={this.client}>
        {this.props.children}
      </RSocketContext.Provider>
    );
  }
}

/**
 * Publish message to RSocket stream
 *
 * @param request
 */
RSocketMockedProvider.publish = (request) => {
  const {
    request: {
      route,
      data = {},
      metadata = {},
    },
    onNext,
  } = request;

  const subscriber = _subscribers.find((_subscriber) => {
    const isRouteEqual = _subscriber.route === route;
    const isDataEqual = isEqual(_subscriber.payload.data, data);
    const isMetadataEqual = isEqual(_subscriber.payload.metadata, metadata);

    return isRouteEqual && isDataEqual && isMetadataEqual;
  });

  if (!subscriber) {
    throw new Error('RSocket Subscriber not found for provided request');
  }

  // Publish message to subscriber
  subscriber.subscriber.onNext(onNext);
};

export default RSocketMockedProvider;
