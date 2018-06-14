import { graphql, compose } from 'react-apollo';
import { createMutation, updateMutation } from '.././../../../../graphql/mutations/campaigns';
import { addWageringFulfillment, addDepositFulfillment } from '.././../../../../graphql/mutations/fulfillments';
import { withNotifications } from '../../../../../components/HighOrder';
import CampaignCreate from '../components/CampaignCreate';

export default compose(
  withNotifications,
  graphql(createMutation, {
    name: 'createCampaign',
  }),
  graphql(updateMutation, {
    name: 'updateCampaign',
  }),
  graphql(addWageringFulfillment, {
    name: 'addWageringFulfillment',
  }),
  graphql(addDepositFulfillment, {
    name: 'addDepositFulfillment',
  }),
)(CampaignCreate);
