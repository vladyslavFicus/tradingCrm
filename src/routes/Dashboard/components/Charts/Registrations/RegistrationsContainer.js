import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { registeredUsersQuery, registeredUsersTotalsQuery } from '../../../../../graphql/queries/statistics';
import { initialQueryParams } from '../utils';
import Registrations from './Registrations';

export default compose(
  graphql(registeredUsersQuery, {
    options: {
      variables: {
        ...initialQueryParams('registrationDateFrom', 'registrationDateTo'),
      },
    },
    name: 'registeredUsers',
  }),
  graphql(registeredUsersTotalsQuery, {
    options: {
      variables: {
        timezone: moment.parseZone(moment()).utcOffset(),
      },
    },
    name: 'registeredUsersTotals',
  }),
)(Registrations);
