import React, { useEffect } from 'react';
import { Config } from '@crm/common';
import useIdleTimer from '../../hooks/useIdleTimer';
import useLogout from '../../hooks/useLogout';
import { useStorage } from '../StorageProvider';

type Props = {
  children: React.ReactNode,
};

const AutoLogoutProvider = (props: Props) => {
  const { children } = props;
  const [handleLogout] = useLogout();

  const storage = useStorage();
  const token = storage.get('token');

  const handleOnTimeout = (timeout: number) => {
    handleLogout(timeout);
  };

  const { start, cleanUp } = useIdleTimer({ onTimeout: handleOnTimeout });

  // ===== Initial IdleTimer setup ===== //
  useEffect(() => {
    const timeout = Config.getBrand()?.backoffice?.ttl_inactive_seconds || 0;

    if (!!token && timeout) {
      start(timeout);
    }
    return () => {
      if (!!token && timeout) {
        cleanUp();
      }
    };
  }, [token]);

  return <>{children}</>;
};

export default React.memo(AutoLogoutProvider);
