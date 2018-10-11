import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withModals } from '@newage/react-hoc';
import { conditionalTagsQuery } from '.././../../../../graphql/queries/conditionalTags';
import CampaignsList from '../components/CampaignsList';
import AddTagsModal from '../components/AddTagsModal';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  withModals({
    addTags: AddTagsModal,
  }),
  graphql(conditionalTagsQuery, {
    name: 'conditionalTags',
    options: ({ location: { query } }) => ({
      fetchPolicy: 'network-only',
      variables: {
        ...query ? query.filters : {},
        size: 10,
        page: 0,
      },
    }),
  }),
)(CampaignsList);
