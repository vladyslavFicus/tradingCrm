import { ApolloLink } from '@apollo/client';
import AuthInjectTokenLink from './AuthInjectTokenLink';
import AuthRefreshTokenLink from './AuthRefreshTokenLink';

/**
 * Auth link to add authorization token to headers of each request and doing auto token refresh in cases when
 * result of request is UNAUTHENTICATED error
 *
 * @param options.uri URI of GraphQL server
 * @param options.getToken Function that returned token and executed for each request
 * @param options.onRefresh Function executed when token should be refreshed and should return token scalar (string)
 * @param options.onLogout Function executed when was an attempt to refresh token and response is UNAUTHENTICATED error
 * @param options.headers Object with additional headers to set to each request
 */
class AuthLink extends ApolloLink {
  constructor(options = {}) {
    super();

    this.skip = options.skip || [];

    this.injectTokenLink = new AuthInjectTokenLink({
      getToken: options.getToken,
      headers: options.headers,
    });

    this.refreshTokenLink = new AuthRefreshTokenLink({
      uri: options.uri,
      getToken: options.getToken,
      onRefresh: options.onRefresh,
      onLogout: options.onLogout,
      headers: options.headers,
    });
  }


  request(operation, forward) {
    this.injectTokenLink.request(operation, forward);

    // Skip refresh link for list of operations
    if (this.skip.includes(operation.operationName)) {
      return forward(operation);
    }

    return this.refreshTokenLink.request(operation, forward);
  }
}

export default AuthLink;
