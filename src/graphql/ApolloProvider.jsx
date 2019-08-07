import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ApolloProvider as ReactApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { from, split } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
import { actionCreators as modalActionCreators } from 'redux/modules/modal';
import { actionTypes as authActionTypes } from 'redux/modules/auth';
import { types as modalTypes } from 'constants/modals';
import queryNames from 'constants/apolloQueryNames';
import { getGraphQLRoot, getApiVersion } from '../config';

const __DEV__ = process.env.NODE_ENV === 'development';

const isObject = node => typeof node === 'object' && node !== null;

const hasFiles = (node, found = []) => {
  Object.keys(node).forEach((key) => {
    if (!isObject(node[key]) || found.length > 0) {
      return;
    }

    if (
      (typeof File !== 'undefined' && node[key] instanceof window.File)
      || (typeof Blob !== 'undefined' && node[key] instanceof window.Blob)
    ) {
      found.push(node[key]);
      return;
    }

    hasFiles(node[key], found);
  });

  return found.length > 0;
};

class ApolloProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
    triggerVersionModal: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.constructor.client = this.createClient();
  }

  createClient = () => {
    const options = {
      uri: getGraphQLRoot(),
      batchInterval: 50,
    };

    // INFO: move heavy request out of batching, so other data don`t hangout
    const batchSplitLink = split(
      ({ operationName }) => Object.values(queryNames).includes(operationName),
      new HttpLink(options),
      new BatchHttpLink(options),
    );

    const httpLink = split(
      ({ variables }) => hasFiles(variables),
      createUploadLink(options),
      batchSplitLink,
    );

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (extensions && extensions.code === 'UNAUTHENTICATED') {
            this.props.logout();

            return;
          }

          // eslint-disable-next-line
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }

      if (networkError) {
        if (networkError.statusCode === 401) {
          this.props.logout();
        }

        if (networkError.statusCode === 426) {
          this.props.triggerVersionModal({ name: modalTypes.NEW_API_VERSION });
          return;
        }

        // eslint-disable-next-line
        console.log(`[Network error]: ${networkError}`);
      }
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'X-CLIENT-Version': getApiVersion(),
      },
    }));

    const cache = new InMemoryCache({
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'PlayerProfile':
            return object.playerUUID
              ? `${object.__typename}:${object.playerUUID}`
              : null;
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
  };

  render() {
    return (
      <ReactApolloProvider client={this.constructor.client}>
        {this.props.children}
      </ReactApolloProvider>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  triggerVersionModal: options => dispatch(modalActionCreators.open(options)),
  logout: () => dispatch({ type: authActionTypes.LOGOUT.SUCCESS }),
});

export default connect(null, mapDispatchToProps)(ApolloProvider);
