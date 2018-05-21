import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import { campaignsQuery } from '.././../../../../graphql/queries/campaigns';
import CampaignsList from '../components/CampaignsList';

const mapStateToProps = ({ i18n: { locale } }) => ({ locale });

export default compose(
  connect(mapStateToProps),
  graphql(campaignsQuery, {
    name: 'campaigns',
    options: () => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        size: 10,
        page: 0,
      },
    }),
    props: ({
      campaigns: {
        campaigns, fetchMore, ...rest
      },
    }) => ({
      campaigns: {
        ...rest,
        campaigns,
        loadMoreCampaigns: () => fetchMore({
          variables: { page: campaigns.number + 1 },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            return {
              ...previousResult,
              ...fetchMoreResult,
              campaigns: {
                ...previousResult.campaigns,
                ...fetchMoreResult.campaigns,
                page: fetchMoreResult.campaigns.page,
                content: [
                  ...previousResult.campaigns.content,
                  ...fetchMoreResult.campaigns.content,
                ],
              },
            };
          },
        }),
      },
    }),
  }),
)(CampaignsList);
