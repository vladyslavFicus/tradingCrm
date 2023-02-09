import React from 'react';
import { useHistory } from 'react-router-dom';
import './HeaderLogout.scss';

const HeaderLogout = () => {
  const history = useHistory();

  const handleLogoutClick = () => {
    history.replace('/logout');
  };

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

export default HeaderLogout;
