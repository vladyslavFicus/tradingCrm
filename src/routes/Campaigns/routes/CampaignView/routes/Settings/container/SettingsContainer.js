import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import { updateMutation } from '.././../../../../../../graphql/mutations/campaigns';
import { addWageringFulfillment } from '.././../../../../../../graphql/mutations/fulfillments';
import { withNotifications } from '../../../../../../../components/HighOrder';
import SettingsView from '../SettingsView';

export default compose(
  withNotifications,
  graphql(campaignQuery, {
    options: ({ params: { id: campaignUUID } }) => ({
      variables: {
        campaignUUID,
      },
    }),
    name: 'campaign',
  }),
  graphql(addWageringFulfillment, {
    name: 'addWageringFulfillment',
  }),
  graphql(updateMutation, {
    name: 'updateCampaign',
  }),
)(SettingsView);
