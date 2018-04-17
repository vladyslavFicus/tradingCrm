import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignQuery } from '.././../../../../graphql/queries/campaigns';
import { activateMutation, cancelMutation } from '.././../../../../graphql/mutations/campaigns';
import CampaignView from '../components/CampaignView';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  graphql(campaignQuery, {
    options: ({ params: { id: campaignUUID } }) => ({
      fetchPolicy: 'network-only',
      variables: {
        campaignUUID,
      },
    }),
    name: 'campaign',
  }),
  graphql(activateMutation, {
    name: 'activateMutation',
  }),
  graphql(cancelMutation, {
    name: 'cancelMutation',
  })
)(CampaignView);
