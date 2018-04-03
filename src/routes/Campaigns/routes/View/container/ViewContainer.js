import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignQuery } from '.././../../../../graphql/queries/campaigns';
import { activateMutation, cancelMutation } from '.././../../../../graphql/mutations/campaigns';
import ViewLayout from '../layouts/ViewLayout';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  graphql(campaignQuery, {
    options: ({ params: { id: campaignUUID } }) => ({
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
)(ViewLayout);
