import moment from 'moment';
import { RegistrationChart } from './components/Charts';

export const initialQueryParams = {
  registrationDateFrom: moment().startOf('day').format(),
  registrationDateTo: moment().format(),
};

export const charts = [{
  name: 'registration',
  component: RegistrationChart,
}];
