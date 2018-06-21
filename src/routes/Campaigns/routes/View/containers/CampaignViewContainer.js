import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignQuery } from '.././../../../../graphql/queries/campaigns';
import {
  activateMutation,
  cancelMutation,
  removeAllPlayersMutation,
  cloneMutation,
} from '.././../../../../graphql/mutations/campaigns';
import { actionCreators } from '../modules';
import CampaignView from '../components/CampaignView';
import { withNotifications } from '../../../../../components/HighOrder';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });
const mapActions = {
  uploadPlayersFile: actionCreators.uploadPlayersFile,
  uploadResetPlayersFile: actionCreators.uploadResetPlayersFile,
};

export default compose(
  connect(mapStateToProps, mapActions),
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
  graphql(cloneMutation, {
    name: 'cloneMutation',
  }),
  withNotifications,
)(CampaignView);
