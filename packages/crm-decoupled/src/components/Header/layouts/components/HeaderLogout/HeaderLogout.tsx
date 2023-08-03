import React from 'react';
import useHeaderLogout from 'components/Header/hooks/useHeaderLogout';
import './HeaderLogout.scss';

const HeaderLogout = () => {
  const { handleLogoutClick } = useHeaderLogout();

  return (
    <div
      className="HeaderLogout"
      onClick={handleLogoutClick}
      title="Log out"
    >
      <i className="icon-signout" />
    </div>
  );
};

export default React.memo(HeaderLogout);
