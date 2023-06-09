import { useApolloClient } from '@apollo/client';
import { useLogoutMutation } from './graphql/__generated__/LogoutMutation';

const useLogout = (storage: Storage) => {
  const client = useApolloClient();

  // ===== Requests ===== //
  const [logoutMutation] = useLogoutMutation();

  // ===== Handlers ===== //
  const handleLogout = async (inactiveSeconds: number | null) => {
    try {
      await logoutMutation({ variables: { inactiveSeconds } });
    } catch (e) {
      // Do nothing...
    } finally {
      storage.remove('token');
      storage.remove('brand');
      storage.remove('auth');
      await client.resetStore();
    }
  };

  return [handleLogout];
};

export default useLogout;
