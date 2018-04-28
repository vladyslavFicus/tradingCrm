import gql from 'graphql-tag';

const gameListQuery = gql`query GameListView(
  $aggregator: String!,
  $page: Int!,
  $size: Int!,
  $gameProvider: String,
  $sort: String,
  $brandId: String!,
) {
  games(
    size: $size,
    page: $page,
    gameProvider: $gameProvider,
    sort: $sort,
    aggregator: $aggregator,
    brandId: $brandId,
  ) {
    page
    last
    content {
      betLevels
      coinSizes
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

export {
  gameListQuery,
};
