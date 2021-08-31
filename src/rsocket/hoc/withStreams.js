import React, { PureComponent } from 'react';
import { isEqual } from 'lodash';
import withRSocket from './withRSocket';

/**
 * withStream HOC to provided rsocket streamable data
 *
 * Example:
 *
 * Provide props in component props with streamed data:
 *
 * export default withStream({
 *   prices: {
 *     route: 'streamPrices',
 *     data: { symbol: 'EURUSD', accountUUID: 'TES-uuid' },
 *     metadata: { someMetadata: 'metadata value' },
 *     skip: false,
 *     accumulator: (curr, next) => ({ ...curr, [next.data.orderId]: next }),
 *   },
 *   ...
 * });
 *
 * @param streamsOptions Object or Func
 * @param streamsOptions.*.route String
 * @param streamsOptions.*.data Object
 * @param streamsOptions.*.metadata Object
 * @param streamsOptions.*.skip Boolean Flag to skip stream request
 * @param streamsOptions.*.accumulator Function Accumulate stream responses by custom logic
 *
 * @return {*}
 */
const withStreams = streamsOptions => (Component) => {
  class WrappedComponent extends PureComponent {
    static propTypes = {
      ...withRSocket.propTypes,
    };

    state = {};

    subscriptions = {};

    componentDidMount() {
      this.subscribe();
    }

    componentDidUpdate() {
      this.subscribe();
    }

    componentWillUnmount() {
      Object.values(this.subscriptions).forEach(({ subscription }) => {
        subscription.cancel();
      });
    }

    isEqualDependencies(key, route, data, metadata) {
      const subscription = this.subscriptions[key];

      if (!subscription) {
        return false;
      }

      return (
        subscription.route === route
        && isEqual(subscription.data, data)
        && isEqual(subscription.metadata, metadata)
      );
    }

    subscribe() {
      const streamsOptionsObject = typeof streamsOptions === 'function' ? streamsOptions(this.props) : streamsOptions;

      Object.keys(streamsOptionsObject).forEach((key) => {
        const {
          route,
          data,
          metadata,
          skip,
          accumulator = (curr, next) => next, // Default accumulator which return next value all time
        } = streamsOptionsObject[key];

        // Skip subscription if skip = true was provided or previous dependencies not changed
        if (skip || this.isEqualDependencies(key, route, data, metadata)) {
          return;
        }

        // Remove existing subscriptions if someone re-subscribing
        if (this.subscriptions[key]) {
          this.subscriptions[key].subscription.cancel();

          delete this.subscriptions[key];
        }

        this.props.rsocket
          .route(route)
          .requestStream({ data, metadata })
          .subscribe({
            onNext: (value) => {
              this.setState(state => ({ [key]: accumulator(state[key], value) }));
            },
            onSubscribe: (subscription) => {
              this.subscriptions[key] = { subscription, data, metadata, route };

              subscription.request(Number.MAX_SAFE_INTEGER);
            },
          });
      });
    }

    render() {
      const {
        rsocket,
        ...props
      } = this.props;

      Object.keys(this.state).forEach((key) => {
        props[key] = this.state[key];
      });

      return <Component {...props} />;
    }
  }

  WrappedComponent.displayName = `withStreams(${(Component.displayName || Component.name)})`;

  return withRSocket(WrappedComponent);
};

export default withStreams;
