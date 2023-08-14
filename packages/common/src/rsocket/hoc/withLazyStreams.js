import React, { PureComponent } from 'react';
import withRSocket from './withRSocket';

/**
 * withLazyStream HOC to provided rsocket streamable requests to props
 *
 * Example:
 *
 * Provide props in component props with streamable requests:
 *
 * export default withLazyStream({
 *   pricesStreamRequest: {
 *     route: 'streamPrices',
 *     data: { symbol: 'EURUSD', accountUUID: 'TES-uuid' },
 *     metadata: { someMetadata: 'metadata value' },
 *   },
 *   ...
 * });
 *
 * --------- INSIDE COMPONENT --------
 * const subscription = this.props.pricesStreamRequest({ data: {...}, metadata: {...} });
 *
 * subscription.onNext((value) => {
 *   console.log(value);
 * });
 *
 * // If need to cancel subscription later
 * subscription.cancel();
 *
 * Each new subscription by existing lazy stream prop, example:
 *   const subscription = this.props.pricesStreamRequest({ data: {...}, metadata: {...} }); by existing props
 * is cancel previous subscription by this props key and make new subscriptions with new provided options.
 *
 * @param streamsOptions Object or Func
 * @param streamsOptions.*.route String
 * @param streamsOptions.*.data Object
 * @param streamsOptions.*.metadata Object
 *
 * @return {*}
 */
const withLazyStreams = streamsOptions => (Component) => {
  class WrappedComponent extends PureComponent {
    static propTypes = {
      ...withRSocket.propTypes,
    };

    // All active subscriptions
    subscriptions = {};

    // Streams options received from withLazyStream HOC
    initialStreamsOptions = typeof streamsOptions === 'function' ? streamsOptions(this.props) : streamsOptions;

    // Generated object with lazy streams props to provide to props for Component
    lazyStreamsProps = Object
      .keys(this.initialStreamsOptions)
      .reduce((acc, streamKey) => {
        acc[streamKey] = (options) => {
          // Cancel subscription if subscription already active and executed second time
          if (this.subscriptions[streamKey]) {
            this.cancel(streamKey);
          }

          // Init stream
          this.request(streamKey, options);

          return {
            onNext: (listener) => {
              this.subscriptions[streamKey].listeners.push(listener);
            },
            cancel: () => this.cancel(streamKey),
          };
        };

        return acc;
      }, {});

    /**
     * Request stream by stream key with options (data, metadata) and onNext handler.
     * data and metadata options will be merged with options defined inside HOC.
     *
     * @param streamKey Stream key
     * @param options Data and metadata to merge with for provided options inside withLazyStreams HOC
     */
    request(streamKey, options = {}) {
      const {
        route,
        data,
        metadata,
      } = this.initialStreamsOptions[streamKey];

      this.props.rsocket
        .route(route)
        .requestStream({
          data: { ...data, ...options.data },
          metadata: { ...metadata, ...options.metadata },
        })
        .subscribe({
          onNext: (value) => {
            // Notify all listeners for each subscription
            this.subscriptions[streamKey].listeners.forEach(listener => listener(value));
          },
          onSubscribe: (subscription) => {
            this.subscriptions[streamKey] = { subscription, listeners: [] };

            subscription.request(Number.MAX_SAFE_INTEGER);
          },
        });
    }

    /**
     * Cancel stream by stream key
     *
     * @param streamKey
     */
    cancel(streamKey) {
      this.subscriptions[streamKey]?.subscription?.cancel();

      delete this.subscriptions[streamKey];
    }

    componentWillUnmount() {
      // Cancel all active streams
      Object.values(this.subscriptions).forEach(({ subscription }) => {
        subscription.cancel();
      });
    }

    render() {
      const {
        rsocket,
        ...props
      } = this.props;

      return <Component {...props} {...this.lazyStreamsProps} />;
    }
  }

  WrappedComponent.displayName = `withLazyStreams(${(Component.displayName || Component.name)})`;

  return withRSocket(WrappedComponent);
};

export default withLazyStreams;
