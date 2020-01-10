import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { operatorsQuery } from 'graphql/queries/operators';
import { getTradingAccount } from 'graphql/queries/tradingAccount';
import FilterFields from './FilterFields';

export default compose(
  withRouter,
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  graphql(getTradingAccount, {
    name: 'tradingAccounts',
    options: ({
      match: {
        params: {
          id: profileUUID,
        },
      },
    }) => ({
      variables: {
        uuid: profileUUID,
      },
    }),
  }),
)(FilterFields);