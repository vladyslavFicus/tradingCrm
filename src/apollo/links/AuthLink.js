import { ApolloLink } from 'apollo-link';
import gql from 'graphql-tag';

const MUTATION = gql`
  mutation TokenRefreshMutation {
    auth {
      tokenRenew {
        token
      }
    }
  } 
`;

/**
 * Auth link to add authorization token to headers of each request and doing auto token refresh in cases when
 * result of request if UNAUTHENTICATED error
 *
 * @param options.getToken Function that returned token and executed for each request
 * @param options.onRefresh Function executed when token was refreshed
 * @param options.onLogout Function executed when was an attempt to refresh token and response is UNAUTHENTICATED error
 * @param options.headers Object with additional headers to set to each request
 */
class AuthLink extends ApolloLink {
  constructor(options = {}) {
    super();

    this.getToken = options.getToken || (() => undefined);
    this.onRefresh = options.onRefresh || (() => undefined);
    this.onLogout = options.onLogout || (() => undefined);
    this.headers = options.headers || {};
  }

  /**
   * Inject apollo client to execute refresh token mutation
   *
   * @param client
   */
  injectClient(client) {
    this.client = client;
  }

  /**
   * Check if response with UNAUTHENTICATED error
   *
   * @param result
   *
   * @return {*}
   */
  isUnauthenticatedError = result => result?.errors?.some(error => error?.extensions?.code === 'UNAUTHENTICATED');

  setHeaders = (operation, customHeaders) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...customHeaders,
      },
    }));
  };

  /**
   * Refresh token handler
   *
   * @param operation
   * @param forward
   *
   * @return {Promise<void>}
   */
  async refreshToken(operation, forward) {
    try {
      // Execute token renew mutation to receive new token
      const { data: { auth: { tokenRenew: { token } } } } = await this.client.mutate({
        mutation: MUTATION,
        context: { skipAuthLink: true },
      });

      // Set new token to previous operation
      this.setHeaders(operation, { authorization: `Bearer ${token}` });

      // Notify about successfully refreshed token
      this.onRefresh(token);

      // Retry to execute previous operation with new token
      return forward(operation).subscribe();
    } catch (e) {
      // Do nothing if something went wrong with refresh mutation...
      // All conditions will be checked in request method depends on operation context
    }

    return null;
  }

  request(operation, forward) {
    const token = this.getToken();
    const { skipAuthLink } = operation.getContext();

    // If token present --> set authorization header to current request
    if (token) {
      this.setHeaders(operation, { authorization: `Bearer ${token}` });
    }

    // If apollo client wasn't initialized --> skip next part of this link to refresh token
    if (!this.client) {
      return forward(operation);
    }

    // Go through the chain and handle result
    return forward(operation).map((result) => {
      // Check if operation response is UNAUTHENTICATED and it's TokenRefreshMutation
      if (skipAuthLink && this.isUnauthenticatedError(result)) {
        this.onLogout();

        return result;
      }

      // Check if operation response is UNAUTHENTICATED then doing refresh token
      if (this.isUnauthenticatedError(result)) {
        return this.refreshToken(operation, forward);
      }

      return result;
    });
  }
}

export default AuthLink;
