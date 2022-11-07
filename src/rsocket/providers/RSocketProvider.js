import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RSocketClient, BufferEncoders } from 'rsocket-core';
import RSocketWebsocketTransport from 'rsocket-websocket-client';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { getRSocketUrl } from 'config';
import { withStorage } from 'providers/StorageProvider';
import RSocketReconnectableClient from '../lib/RSocketReconnectableClient';
import TokenRefreshMutation from './graphql/TokenRefreshMutation';

export const RSocketContext = React.createContext();

class RSocketProvider extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    children: PropTypes.element.isRequired,
    tokenRefresh: PropTypes.func.isRequired,
  };

  client = new RSocketReconnectableClient(
    this.createClient,
    {
      interval: 5000,
      getToken: () => this.props.storage.get('token'),
      onRefreshToken: () => this.onRefreshToken(),
    },
  );

  componentWillUnmount() {
    this.client.close();
  }

  /**
   * On token refresh handler
   *
   * @return {Promise<void>}
   */
  onRefreshToken = async () => {
    const {
      storage,
      tokenRefresh,
    } = this.props;

    const { data: { auth: { tokenRenew: { token } } } } = await tokenRefresh();

    storage.set('token', token);
  };

  createClient() {
    return new RSocketClient({
      setup: {
        keepAlive: 20000,
        lifetime: 180000,
        dataMimeType: 'application/json',
      },
      transport: new RSocketWebsocketTransport({ url: getRSocketUrl() }, BufferEncoders),
    });
  }

  render() {
    return (
      <RSocketContext.Provider value={this.client}>
        {this.props.children}
      </RSocketContext.Provider>
    );
  }
}

export const RSocketConsumer = RSocketContext.Consumer;

export default compose(
  withStorage,
  withRequests({
    tokenRefresh: TokenRefreshMutation,
  }),
)(RSocketProvider);
