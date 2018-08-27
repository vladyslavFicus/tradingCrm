import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { profileQuery } from '../../../../../../../../../graphql/queries/profile';
import View from '../components/View';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
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
      fetchPolicy: 'cache-only',
    }),
    name: 'playerProfile',
  })
)(View);
