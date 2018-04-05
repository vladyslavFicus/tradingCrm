import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import { updateMutation } from '.././../../../../../../graphql/mutations/campaigns';
import { withNotifications } from '../../../../../../../components/HighOrder';
import SettingsView from '../components/SettingsView';

export default compose(
  withNotifications,
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
)(SettingsView);
