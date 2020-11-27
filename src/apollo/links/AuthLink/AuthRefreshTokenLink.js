import { ApolloLink, from, Observable } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import AuthInjectTokenLink from './AuthInjectTokenLink';
import Queue from './Queue';
import { isUnauthenticatedError } from './utils';

/**
 * Auth refresh token link doing auto token refresh in cases when result of requests is UNAUTHENTICATED error
 *
 * @param options.uri URI of GraphQL server
 * @param options.getToken Function that returned token and executed for each request
 * @param options.onRefresh Function executed when token should be refreshed and should return token scalar (string)
 * @param options.onLogout Function executed when was an attempt to refresh token and response is UNAUTHENTICATED error
 * @param options.headers Object with additional headers to set to each request
 */
class AuthRefreshTokenLink extends ApolloLink {
  constructor(options = {}) {
    super();

    // New instance of Apollo client to use it in onRefresh callback
    // We can not use existent Apollo Client because it's working unpredictable
    this.client = new ApolloClient({
      cache: new InMemoryCache(),
      link: from([
        new AuthInjectTokenLink({
          getToken: options.getToken,
          headers: options.headers,
        }),
        new HttpLink({ uri: options.uri }),
      ]),
    });

    // Queue with unauthenticated operations
    this.queue = new Queue();

    // Indicator while token refresh request is executing
    this.refreshing = false;

    this.onRefresh = options.onRefresh || (() => undefined);
    this.onLogout = options.onLogout || (() => undefined);
  }

  /**
   * Refresh token and consume operations queue
   *
   * @return {Promise<void>}
   */
  async refreshToken() {
    // Refresh token only if it isn't if flight now
    if (!this.refreshing) {
      this.refreshing = true;

      // Doing refresh token and retry previous operations
      const refreshedToken = await this.onRefresh(this.client);

      // If token available --> consume queue, else --> clean queue and doing logout
      if (refreshedToken) {
        this.queue.consume(refreshedToken);
      } else {
        this.queue.clean();

        this.onLogout();
      }

      this.refreshing = false;
    }
  }

  request(operation, forward) {
    const definition = getMainDefinition(operation.query);

    const isSubscription = definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: async (result) => {
          const isUnauthenticated = isUnauthenticatedError(result);

          if (isUnauthenticated) {
            // Enqueue non-subscription unauthenticated operation to execute it when token will be refreshed
            if (!isSubscription) {
              this.queue.push({ operation, forward, observer });
            }

            await this.refreshToken();

            return;
          }

          // Execute next link
          observer.next(result);

          // Complete operation if it isn't subscription
          if (!isSubscription) {
            observer.complete();
          }
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}

export default AuthRefreshTokenLink;
