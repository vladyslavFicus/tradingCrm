import React, { useEffect } from 'react';
import compose from 'compose-function';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';
import useLogout from './useLogout';

type Props = {
  storage: Storage,
};

const Logout = (props: Props) => {
  const { storage } = props;

  const [handleLogout] = useLogout(storage);

  // ===== Effects ===== //
  useEffect(() => {
    handleLogout(null);
  }, []);

  // Redirect implemented inside Route component. If user unauthenticated and asked for private route --> redirect it.
  return <Preloader />;
};

export default compose(
  React.memo,
  withStorage,
)(Logout);
