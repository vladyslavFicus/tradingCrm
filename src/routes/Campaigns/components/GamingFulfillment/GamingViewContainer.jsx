import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import GamingView from './GamingView';
import { withReduxFormValues } from '../../../../components/HighOrder';
import { gameProvidersQuery } from '../../../../graphql/queries/games';

export default compose(
  connect(({ auth: { brandId } }) => ({ brandId })),
  graphql(gameProvidersQuery, {
    name: 'gameProviders',
    options: ({ brandId }) => ({
      variables: {
        brandId,
      },
    }),
    skip: ({ brandId }) => !brandId,
  }),
  withReduxFormValues,
)(GamingView);
