import gql from 'graphql-tag';

const gameListQuery = gql`query GameListView(
  $aggregator: String!,
  $page: Int!,
  $size: Int!,
  $gameProvider: String,
  $sort: String,
  $brandId: String!,
  $type: String,
) {
  games(
    size: $size,
    page: $page,
    gameProvider: $gameProvider,
    sort: $sort,
    aggregator: $aggregator,
    brandId: $brandId,
    type: $type,
  ) {
    page
    last
    content {
      betLevels
      coinSizes
      coinsMin
      coinsMax
      lines
      internalGameId
      startGameUrl
      gameId
      clientId
      moduleId
      pageCodes {
        label
        value
      }
      fullGameName
    }
  }
}`;

const cmsProvidersQuery = gql`query GamesProviders{ cmsProviders { name } }`;

const cmsGamesQuery = gql`query GamesView(
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
    offset
    content {
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
  }
}`;

export {
  gameListQuery,
  cmsGamesQuery,
  cmsProvidersQuery,
};
