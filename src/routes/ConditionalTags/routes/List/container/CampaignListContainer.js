import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { conditionalTagsQuery } from '.././../../../../graphql/queries/conditionalTags';
import CampaignsList from '../components/CampaignsList';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
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
