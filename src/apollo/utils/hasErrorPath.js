/**
 * Utils method to help recognize if specific path has error
 *
 * @param apolloError {ApolloError} Instance of ApolloError
 * @param path Apollo field path
 *
 * @return {*}
 */
export default (apolloError, path) => (
  apolloError?.graphQLErrors?.find(error => error.path.join('.') === path)
);
