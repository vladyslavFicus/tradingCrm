import moment from 'moment';
import { Profile } from '__generated__/types';

type Props = {
  profile: Profile,
};

type UseClientLastActivity = {
  lastActivityType: 'ONLINE' | 'OFFLINE',
  lastActivityDate: moment.Moment | null,
  location?: string | null,
  eventType?: string | null,
  eventValue?: string | null,
};

const useClientLastActivity = (props: Props): UseClientLastActivity => {
  const { profile } = props;

  const lastActivity = profile.profileView?.lastActivity;
  const { eventType, eventValue, location, date } = lastActivity || {};
  const lastActivityDate = date ? moment.utc(date).local() : null;
  const lastActivityType = profile.profileView?.online ? 'ONLINE' : 'OFFLINE';

  return {
    lastActivityType,
    lastActivityDate,
    location,
    eventType,
    eventValue,
  };
};

export default useClientLastActivity;
