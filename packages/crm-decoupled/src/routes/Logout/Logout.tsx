import React, { useEffect } from 'react';
import { Preloader } from 'components';
import useLogout from './useLogout';

const Logout = () => {
  const [handleLogout] = useLogout();

  // ===== Effects ===== //
  useEffect(() => {
    handleLogout();
  }, []);

  // Redirect implemented inside Route component. If user unauthenticated and asked for private route --> redirect it.
  return <Preloader />;
};

export default React.memo(Logout);
