import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { registeredUsersQuery, registeredUsersTotalsQuery } from 'graphql/queries/statistics';
import { initialDateQueryParams } from '../dashboardChartsUtils';
import RegistrationsChart from './RegistrationsChart';

export default compose(
  graphql(registeredUsersQuery, {
    options: {
      variables: {
        ...initialDateQueryParams('dateFrom', 'dateTo'),
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
)(RegistrationsChart);
