import { graphql, compose, withApollo } from 'react-apollo';
import { profileQuery } from '../../../../../../../../../graphql/queries/profile';
import TradingActivity from '../components/TradingActivity';

export default compose(
  withApollo,
  graphql(profileQuery, {
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
