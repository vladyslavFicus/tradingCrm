import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import ViewLayout from '../components/View';

export default compose(
  graphql(campaignQuery, {
    options: ({ params: { id: campaignUUID } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        campaignUUID,
      },
    }),
    name: 'campaign',
  }),
)(ViewLayout);
