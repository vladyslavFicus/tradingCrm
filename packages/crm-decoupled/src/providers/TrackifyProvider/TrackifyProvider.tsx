import React, { useEffect } from 'react';
import Trackify from '@hrzn/trackify';
import { Config } from '@crm/common';
import { useStorageState } from 'providers/StorageProvider';
import { useTrackifyMutation } from './graphql/__generated__/TrackifyMutation';

type Props = {
  children: React.ReactNode,
};

const TrackifyProvider = (props: Props) => {
  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');

  const [track] = useTrackifyMutation();

  // ===== Initial trackify setup ===== //
  useEffect(() => {
    Trackify.setup('backoffice', Config.getVersion());

    Trackify.request(async (queue) => {
      // Send events to server only for authorized clients
      if (token) {
        try {
          await track({ variables: { args: queue } });
        } catch (e) {
          // Do nothing...
        }
      }
    });
  }, [token, track]);

  return (
    <>
      {props.children}
    </>
  );
};

export default React.memo(TrackifyProvider);
