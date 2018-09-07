import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import { updateMutation } from '.././../../../../../../graphql/mutations/campaigns';
import {
  addDepositFulfillment,
  addWageringFulfillment,
  updateDepositFulfillment,
} from '.././../../../../../../graphql/mutations/fulfillments';
import { createOrLinkTagMutation } from '.././../../../../../../graphql/mutations/tag';
import { withNotifications } from '../../../../../../../components/HighOrder';
import SettingsView from '../components/SettingsView';

export default compose(
  withNotifications,
  graphql(campaignQuery, {
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      variables: {
        campaignUUID,
      },
    }),
    name: 'campaign',
  }),
  graphql(addWageringFulfillment, {
    name: 'addWageringFulfillment',
  }),
  graphql(addDepositFulfillment, {
    name: 'addDepositFulfillment',
  }),
  graphql(updateDepositFulfillment, {
    name: 'updateDepositFulfillment',
  }),
  graphql(updateMutation, {
    name: 'updateCampaign',
  }),
  graphql(createOrLinkTagMutation, {
    name: 'createOrLinkTag',
  }),
)(SettingsView);
