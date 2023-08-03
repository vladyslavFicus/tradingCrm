import moment from 'moment';
import { Profile } from '__generated__/types';

type Props = {
  profile: Profile,
};

type UseClientRegistrationInfo = {
  registrationDate: string,
  timeFromNow: string,
  formatDate: string,
};

const useClientRegistrationInfo = (props: Props): UseClientRegistrationInfo => {
  const { profile } = props;

  const registrationDate = profile.registrationDetails.registrationDate || '';
  const timeFromNow = moment.utc(registrationDate).local().fromNow();
  const formatDate = moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm');

  return {
    registrationDate,
    timeFromNow,
    formatDate,
  };
};

export default useClientRegistrationInfo;
