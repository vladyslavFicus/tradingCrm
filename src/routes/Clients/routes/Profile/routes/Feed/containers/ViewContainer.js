import { graphql, compose, withApollo } from 'react-apollo';
import { feedsQuery, feedTypesQuery } from 'graphql/queries/audit';
import { createQueryPagination } from '@newage/backoffice_utils';
import Feed from '../components/Feed';

export default compose(
  withApollo,
  graphql(feedTypesQuery, {
    name: 'feedTypes',
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: { playerUUID },
    }),
  }),
  graphql(feedsQuery, {
    name: 'feeds',
    options: ({ match: { params: { id } }, location: { query } }) => ({
      fetchPolicy: 'cache-and-network',
      variables: {
        ...query ? query.filters : {},
        targetUUID: id,
        limit: 20,
        page: 0,
      },
    }),
    props: ({ feeds: { feeds, fetchMore, ...rest } }) => ({
      feeds: {
        ...rest,
        feeds,
        loadMoreFeeds: () => {
          const data = feeds && feeds.data ? feeds.data : {};
          createQueryPagination(fetchMore, { page: data.number + 1, limit: 20 }, 'feeds.data');
        },
      },
    }),
  }),
)(Feed);
