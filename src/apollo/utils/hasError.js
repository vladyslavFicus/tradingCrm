/**
 * Utils method to help recognize if specific error code in graphQLErrors
 *
 * @param apolloError {ApolloError} Instance of ApolloError
 * @param code Apollo extension code
 *
 * @return {*}
 */
export default (apolloError, code) => (
  apolloError.graphQLErrors.find(error => error.extensions.code === code)
);
