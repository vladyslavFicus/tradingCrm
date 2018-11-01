import { graphql, compose, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { clientQuery } from '../../../../../../../../../graphql/queries/profile';
import TradingActivity from '../components/TradingActivity';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
  withApollo,
  connect(mapStateToProps),
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
