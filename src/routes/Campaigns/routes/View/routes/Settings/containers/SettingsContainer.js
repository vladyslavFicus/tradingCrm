import { graphql, compose } from 'react-apollo';
import { campaignQuery } from '.././../../../../../../graphql/queries/campaigns';
import { updateMutation } from '.././../../../../../../graphql/mutations/campaigns';
import {
  addDepositFulfillment,
  addWageringFulfillment,
  updateDepositFulfillment,
  addGamingFulfillment,
  updateGamingFulfillment,
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
  graphql(addGamingFulfillment, {
    name: 'addGamingFulfillment',
  }),
  graphql(updateDepositFulfillment, {
    name: 'updateDepositFulfillment',
  }),
  graphql(updateGamingFulfillment, {
    name: 'updateGamingFulfillment',
  }),
  graphql(updateMutation, {
    name: 'updateCampaign',
  }),
  graphql(createOrLinkTagMutation, {
    name: 'createOrLinkTag',
  }),
)(SettingsView);
