import moment from 'moment';
import { RegistrationChart } from './components/Charts';

export const initialQueryParams = {
  registrationDateFrom: moment().subtract(6, 'days').startOf('day').format(),
  registrationDateTo: moment().add(1, 'day').startOf('day').format(),
};

export const charts = [{
  name: 'registration',
  component: RegistrationChart,
}];
