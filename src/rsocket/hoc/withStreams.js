import React, { PureComponent } from 'react';
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
 *   },
 *   ...
 * });
 *
 * @param streamsOptions Object or Func
 * @param streamsOptions.*.route String
 * @param streamsOptions.*.data Object
 * @param streamsOptions.*.metadata Object
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
      const streamsOptionsObject = typeof streamsOptions === 'function' ? streamsOptions(this.props) : streamsOptions;

      Object.keys(streamsOptionsObject).forEach((key) => {
        const {
          route,
          data,
          metadata,
        } = streamsOptionsObject[key];

        this.props.rsocket
          .route(route)
          .requestStream({ data, metadata })
          .subscribe({
            onNext: (value) => {
              this.setState({ [key]: value });
            },
            onSubscribe: (subscription) => {
              this.subscriptions[key] = subscription;

              subscription.request(Number.MAX_SAFE_INTEGER);
            },
          });
      });
    }

    componentWillUnmount() {
      Object.values(this.subscriptions).forEach((subscription) => {
        subscription.cancel();
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
