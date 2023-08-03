import moment from 'moment';
import { Profile, ProfileView__Sessions as ProfileViewSessions } from '__generated__/types';

type Props = {
  profile: Profile,
};

type UseClientLastLogin = {
  lastSignInSession?: ProfileViewSessions | null,
  startedAt: string,
  countryCode: string,
  timeFromNow: string,
  formatDate: string,
};

const useClientLastLogin = (props: Props): UseClientLastLogin => {
  const { profile } = props;

  const lastSignInSessions = profile.profileView?.lastSignInSessions;
  const lastSignInSession = lastSignInSessions && lastSignInSessions[lastSignInSessions.length - 1];
  const { startedAt = '', countryCode = '' } = lastSignInSession || {};

  const timeFromNow = moment.utc(startedAt).local().fromNow();
  const formatDate = moment.utc(startedAt).local().format('DD.MM.YYYY HH:mm');

  return {
    lastSignInSession,
    startedAt,
    countryCode,
    timeFromNow,
    formatDate,
  };
};

export default useClientLastLogin;
