import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignQuery } from '.././../../../../graphql/queries/campaigns';
import {
  activateMutation,
  cancelMutation,
  removeAllPlayersMutation,
  fullResetCampaignMutation,
  cloneMutation,
} from '.././../../../../graphql/mutations/campaigns';
import CampaignView from '../components/CampaignView';
import { withNotifications } from '../../../../../components/HighOrder';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  graphql(campaignQuery, {
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      fetchPolicy: 'network-only',
      variables: {
        campaignUUID,
      },
    }),
    name: 'campaign',
  }),
  graphql(activateMutation, {
    name: 'activateMutation',
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      refetchQueries: [{
        query: campaignQuery,
        variables: {
          campaignUUID,
        },
      }],
    }),
  }),
  graphql(cancelMutation, {
    name: 'cancelMutation',
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      refetchQueries: [{
        query: campaignQuery,
        variables: {
          campaignUUID,
        },
      }],
    }),
  }),
  graphql(removeAllPlayersMutation, {
    name: 'removeAllPlayers',
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      refetchQueries: [{
        query: campaignQuery,
        variables: {
          campaignUUID,
        },
      }],
    }),
  }),
  graphql(fullResetCampaignMutation, {
    name: 'fullResetCampaign',
    options: ({ match: { params: { id: campaignUUID } } }) => ({
      refetchQueries: [{
        query: campaignQuery,
        variables: {
          campaignUUID,
        },
      }],
    }),
  }),
  graphql(cloneMutation, {
    name: 'cloneMutation',
  }),
  withNotifications,
)(CampaignView);
