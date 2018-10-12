import { graphql, compose, withApollo } from 'react-apollo';
import { clientQuery } from '../../../../../../../../../graphql/queries/profile';
import TradingActivity from '../components/TradingActivity';

export default compose(
  withApollo,
  graphql(clientQuery, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'playerProfile',
  }),
)(TradingActivity);
