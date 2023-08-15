import React, { useEffect } from 'react';
import { useLogout, Preloader } from '@crm/common';

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
