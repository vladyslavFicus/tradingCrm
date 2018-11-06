import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider as ReactApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { from, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createUploadLink } from 'apollo-upload-client';
import { getGraphQLRoot } from '../config';

const __DEV__ = process.env.NODE_ENV === 'development';

const isObject = node => typeof node === 'object' && node !== null;

const hasFiles = (node, found = []) => {
  Object.keys(node).forEach(key => {
    if (!isObject(node[key]) || found.length > 0) {
      return;
    }

    if (
      (typeof File !== 'undefined' && node[key] instanceof File) ||
      (typeof Blob !== 'undefined' && node[key] instanceof Blob)
    ) {
      found.push(node[key]);
      return;
    }

    hasFiles(node[key], found);
  });

  return found.length > 0;
};

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

  createClient() {
    const options = {
      uri: getGraphQLRoot(),
      batchInterval: 50,
    };
    const httpLink = split(
      ({ variables }) => hasFiles(variables),
      createUploadLink(options),
      new BatchHttpLink(options)
    );
    const errorLink = onError(({ graphQLErrors, response, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
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

    const cache = new InMemoryCache({
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'PlayerProfile':
            return object.playerUUID ?
              `${object.__typename}:${object.playerUUID}` :
              null;
          default:
            return object._id ? `${object.__typename}:${object._id}` : null;
        }
      },
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache,
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
