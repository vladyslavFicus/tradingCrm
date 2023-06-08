import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { useApolloClient } from '@apollo/client';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';
import { useLogoutMutation } from './graphql/__generated__/LogoutMutation';

type Props = {
  storage: Storage,
};

const Logout = (props: Props) => {
  const { storage } = props;
  const location = useLocation();

  const inactiveSecondsParam = new URLSearchParams(location.search).get('timeout');
  const inactiveSeconds = (inactiveSecondsParam !== null)
    ? parseInt(inactiveSecondsParam, 10)
    : null;

  const client = useApolloClient();

  // ===== Requests ===== //
  const [logoutMutation] = useLogoutMutation();

  // ===== Handlers ===== //
  const handleLogout = async () => {
    try {
      await logoutMutation({ variables: { inactiveSeconds } });
    } catch (e) {
      // Do nothing...
    } finally {
      storage.remove('token');
      storage.remove('brand');
      storage.remove('auth');
      client.resetStore();
    }
  };

  // ===== Effects ===== //
  useEffect(() => {
    handleLogout();
  }, []);

  // Redirect implemented inside Route component. If user unauthenticated and asked for private route --> redirect it.
  return <Preloader />;
};

export default compose(
  React.memo,
  withStorage,
)(Logout);
