import { ApolloLink } from '@apollo/client';
import { setHeaders } from './utils';

/**
 * Inject authorization token and additional headers to each operation
 *
 * @param options.getToken Function that returned token and executed for each request
 * @param options.headers Object with additional headers to set to each request
 */
class AuthInjectTokenLink extends ApolloLink {
  constructor(options = {}) {
    super();

    this.getToken = options.getToken || (() => undefined);
    this.headers = options.headers || {};
  }

  request(operation, forward) {
    const token = this.getToken();

    const headers = {
      ...this.headers,
      ...(token && { authorization: `Bearer ${token}` }),
    };

    setHeaders(operation, headers);

    return forward(operation);
  }
}

export default AuthInjectTokenLink;
