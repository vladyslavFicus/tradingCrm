import React, { useEffect } from 'react';
import compose from 'compose-function';
import { useHistory } from 'react-router-dom';
import { getBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import IdleTimer from './IdleTimer';

type Props = {
  storage: Storage,
  children: React.ReactNode,
  token?: String,
};

const AutoLogoutProvider = (props: Props) => {
  const { token, children } = props;

  const history = useHistory();
  const handleTimerEvent = (timeout: Number) => history.push(`/logout?timeout=${timeout}`);

  // ===== Initial IdleTimer setup ===== //
  useEffect(() => {
    const timeout = getBrand()?.backoffice?.ttl_inactive_seconds || 30;
    const timer = (token && !!timeout) ? new IdleTimer({
      storage: props.storage,
      timeout, // logout after idle seconds
      onTimeout: handleTimerEvent,
    }) : null;

    return () => timer?.cleanUp();
  }, [token]);

  return children;
};

export default compose(
  React.memo,
  withStorage(['token']),
)(AutoLogoutProvider);
