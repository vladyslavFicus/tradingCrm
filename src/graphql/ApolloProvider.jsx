import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider as ReactApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getGraphQLRoot } from '../config';

const __DEV__ = process.env.NODE_ENV === 'development';

class ApolloProvider extends PureComponent {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);

    this.constructor.client = this.createClient();
  }

  state = {
    isError: false,
  };


  createClient() {
    const httpLink = new BatchHttpLink({ uri: getGraphQLRoot(), batchInterval: 50 });
    const errorLink = onError(({ graphQLErrors, response, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }

      this.setState({ isError: true });
    });

    const authLink = setContext((_, { headers }) => {
      const { auth: { token } } = this.context.store.getState();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : undefined,
        },
      };
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        dataIdFromObject: object => object.PK_ID || null,
      }),
      connectToDevTools: __DEV__,
    });
  }

  render() {
    return (
      <ReactApolloProvider client={this.constructor.client}>
        {this.props.children}
      </ReactApolloProvider>
    );
  }
}

export default ApolloProvider;
