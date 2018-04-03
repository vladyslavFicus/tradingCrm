import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import { updateMutation } from '.././../../../../../../graphql/mutations/campaigns';
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
  graphql(updateMutation, {
    name: 'updateCampaign',
  }),
)(ViewLayout);
