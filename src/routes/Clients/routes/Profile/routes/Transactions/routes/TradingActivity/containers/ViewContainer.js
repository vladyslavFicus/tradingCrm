import { graphql, compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { profileQuery } from '../../../../../../../../../graphql/queries/profile';
import TradingActivity from '../components/TradingActivity';

const mapStateToProps = ({
  i18n,
}) => ({
  ...i18n,
  // filterErrors: getFormSyncErrors('userTradingActivityFilter')(state),
});

export default compose(
  withApollo,
  connect(mapStateToProps),
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
