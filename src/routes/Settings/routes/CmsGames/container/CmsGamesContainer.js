import { compose, graphql } from 'react-apollo';
import CmsGamesView from '../components/CmsGamesView';
import { getBrandId } from '../../../../../config';
import { cmsGamesQuery, cmsProvidersQuery } from '../../../../../graphql/queries/games';

export default compose(
  graphql(cmsProvidersQuery, { name: 'providers' }),
  graphql(cmsGamesQuery, {
    name: 'games',
    options: () => ({
      variables: {
        limit: 25,
        offset: 0,
        brandId: getBrandId(),
      },
    }),
    props: (({ games, ownProps }) => ({
      ...ownProps,
      games: {
        ...games,
        onLoadMore: variables => games.fetchMore({
          variables: {
            ...variables,
            brandId: getBrandId(),
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }

            return {
              ...prev,
              ...fetchMoreResult,
              cmsGames: {
                ...prev.cmsGames,
                ...fetchMoreResult.cmsGames,
                offset: fetchMoreResult.cmsGames.offset,
                content: [
                  ...prev.cmsGames.content,
                  ...fetchMoreResult.cmsGames.content,
                ],
              },
            };
          },
        }),
      },
    })),
  })
)(CmsGamesView);
