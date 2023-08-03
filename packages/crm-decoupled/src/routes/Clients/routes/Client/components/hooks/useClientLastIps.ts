import { uniqBy } from 'lodash';
import { Profile, ProfileView__Sessions as UniqueIp } from '__generated__/types';

type Props = {
  profile: Profile,
};

type UseClientLastIps = {
  uniqueIps: Array<UniqueIp>,
};

const useClientLastIps = (props: Props): UseClientLastIps => {
  const { profile } = props;

  const lastSignInSessions = profile.profileView?.lastSignInSessions || [];
  const uniqueIps = uniqBy(lastSignInSessions, ({ ip }) => ip);

  return {
    uniqueIps,
  };
};

export default useClientLastIps;
