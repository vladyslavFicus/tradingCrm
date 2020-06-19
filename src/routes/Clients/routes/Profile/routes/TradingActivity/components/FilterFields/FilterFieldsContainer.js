import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { operatorsQuery } from 'graphql/queries/operators';
import { getClientTradingAccounts } from 'graphql/queries/tradingAccount';
import FilterFields from './FilterFields';

export default compose(
  withRouter,
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  graphql(getClientTradingAccounts, {
    name: 'clientTradingAccounts',
    options: ({
      match: {
        params: {
          id: profileUUID,
        },
      },
    }) => ({
      variables: {
        profileUUID,
      },
    }),
  }),
)(FilterFields);
