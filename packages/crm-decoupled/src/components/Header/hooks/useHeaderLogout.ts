import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useHeaderLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = useCallback(() => {
    navigate('/logout', { replace: true });
  }, []);

  return { handleLogoutClick };
};

export default useHeaderLogout;
