import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import { useStorage } from '../providers/StorageProvider';
import { useLogoutMutation } from './graphql/__generated__/LogoutMutation';

const useLogout = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const storage = useStorage();

  // ===== Requests ===== //
  const [logoutMutation] = useLogoutMutation();

  // ===== Handlers ===== //
  const handleLogout = async (inactiveSeconds: number | null = null) => {
    try {
      await logoutMutation({ variables: { inactiveSeconds } });
    } catch (e) {
      // Do nothing...
    } finally {
      storage.remove('token');
      storage.remove('brand');
      storage.remove('auth');
      await client.resetStore();
      navigate('/');
    }
  };

  return [handleLogout];
};

export default useLogout;
