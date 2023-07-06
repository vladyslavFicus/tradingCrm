import React, { useEffect } from 'react';
import compose from 'compose-function';
import { getBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import useIdleTimer from 'hooks/useIdleTimer';
import useLogout from 'routes/Logout/useLogout';

type Props = {
  storage: Storage,
  children: React.ReactNode,
  token?: String,
};

const AutoLogoutProvider = (props: Props) => {
  const { token, children, storage } = props;

  const [handleLogout] = useLogout(storage);

  const handleOnTimeout = (timeout: number) => {
    handleLogout(timeout);
  };

  const { start, cleanUp } = useIdleTimer({ onTimeout: handleOnTimeout });

  // ===== Initial IdleTimer setup ===== //
  useEffect(() => {
    const timeout = getBrand()?.backoffice?.ttl_inactive_seconds;

    if (!!token && timeout) {
      start(timeout);
    }
    return () => {
      if (!!token && timeout) {
        cleanUp();
      }
    };
  }, [token]);

  return children;
};

export default compose(
  React.memo,
  withStorage(['token']),
)(AutoLogoutProvider);
