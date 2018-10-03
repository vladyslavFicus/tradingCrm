import { graphql, compose } from 'react-apollo';
import LeadProfile from '../components/LeadProfile';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import { leadProfileQuery } from '../../../../../graphql/queries/leads';
import { promoteLeadToClient } from '../../../../../graphql/mutations/leads';
import PromoteLeadModal from '../../../../../components/PromoteLeadModal';

export default compose(
  withNotifications,
  withModals({
    promoteLeadModal: PromoteLeadModal,
  }),
  graphql(promoteLeadToClient, {
    name: 'promoteLead',
  }),
  graphql(leadProfileQuery, {
    options: ({
      match: {
        params: {
          id: leadId,
        },
      },
    }) => ({
      variables: {
        leadId,
      },
    }),
    name: 'leadProfile',
  }),
)(LeadProfile);
