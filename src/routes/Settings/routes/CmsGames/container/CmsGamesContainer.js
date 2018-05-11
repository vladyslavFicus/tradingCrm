import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import CmsGamesView from '../components/CmsGamesView';
import { getBrandId } from '../../../../../config';

const providersQuery = gql`query { cmsProviders { name } }`;

const gamesQuery = gql`query GamesView(
    $brandId: String!,
    $platform: CmsGamePlatform,
    $technology: CmsGameTechnology,
    $freeSpinsStatus: CmsGameFreeSpinsStatus,
    $status: CmsGameStatus,
    $offset: Int!,
    $limit: Int!
  ) {
  cmsGames(
    brandId: $brandId,
    platform: $platform,
    technology: $technology,
    freeSpinsStatus: $freeSpinsStatus,
    status: $status,
    limit: $limit,
    offset: $offset
  ) {
    internalGameId
    title
    alias
    aggregator {
      name
    }
    provider {
      name
    }
    platform
    technology
    freeSpinsStatus
    status
  }
}`;

export default compose(
  graphql(providersQuery, { name: 'providers' }),
  graphql(gamesQuery, {
    name: 'games',
    options: () => ({
      variables: {
        limit: 25,
        offset: 0,
        brandId: getBrandId(),
      },
    }),
    props: (({ games, ownProps }) => {
      console.log(games.variables, games.cmsGames);

      return {
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
                cmsGames: [
                  ...prev.cmsGames,
                  ...fetchMoreResult.cmsGames,
                ],
              };
            },
          }),
        },
      };
    }),
  })
)(CmsGamesView);
