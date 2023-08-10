import React, { useEffect } from 'react';
import { RSocketClient, BufferEncoders } from 'rsocket-core';
import RSocketWebsocketTransport from 'rsocket-websocket-client';
import { Config, useStorage } from '@crm/common';
import RSocketReconnectableClient from '../lib/RSocketReconnectableClient';
import { useTokenRefreshMutation } from './graphql/__generated__/TokenRefreshMutation';

type Props = {
  children: React.ReactNode,
};

export const RSocketContext = React.createContext<RSocketReconnectableClient>({} as RSocketReconnectableClient);

const RSocketProvider = (props: Props) => {
  // ===== Storage ===== //
  const storage = useStorage();

  // ===== Requests ===== //
  const [tokenRefresh] = useTokenRefreshMutation();

  const createClient = () => new RSocketClient({
    setup: {
      keepAlive: 20000,
      lifetime: 180000,
      dataMimeType: 'application/json',
      metadataMimeType: '',
    },
    transport: new RSocketWebsocketTransport({ url: Config.getRSocketUrl() }, BufferEncoders),
  });

  const client = new RSocketReconnectableClient(
    createClient,
    {
      interval: 5000,
      getToken: () => storage.get('token'),
      onRefreshToken: async () => {
        const { data } = await tokenRefresh();
        storage.set('token', data?.auth.tokenRenew?.token);
      },
    },
  );

  // ===== Effects ===== //
  useEffect(() => () => client.close(), [client]);

  return (
    <RSocketContext.Provider value={client}>
      {props.children}
    </RSocketContext.Provider>
  );
};

export const RSocketConsumer = RSocketContext.Consumer;

export default React.memo(RSocketProvider);
