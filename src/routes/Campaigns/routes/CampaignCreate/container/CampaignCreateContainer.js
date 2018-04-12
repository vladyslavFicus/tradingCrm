import { graphql, compose } from 'react-apollo';
import { createMutation } from '.././../../../../graphql/mutations/campaigns';
import { withNotifications } from '../../../../../components/HighOrder';
import CampaignCreate from '../CampaignCreate';

export default compose(
  withNotifications,
  graphql(createMutation, {
    name: 'createCampaign',
  }),
)(CampaignCreate);
