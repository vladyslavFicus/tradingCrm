import React, { useEffect } from 'react';
import Trackify from '@hrzn/trackify';
import compose from 'compose-function';
import { getVersion } from 'config';
import { withStorage } from 'providers/StorageProvider';
import { useTrackifyMutation } from './graphql/__generated__/TrackifyMutation';

type Props = {
  children: React.ReactElement,
  token?: string,
};

const TrackifyProvider = (props: Props) => {
  const { token, children } = props;

  const [track] = useTrackifyMutation();

  // ===== Initial trackify setup ===== //
  useEffect(() => {
    Trackify.setup('backoffice', getVersion());

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

  return children;
};

export default compose(
  React.memo,
  withStorage(['token']),
)(TrackifyProvider);
