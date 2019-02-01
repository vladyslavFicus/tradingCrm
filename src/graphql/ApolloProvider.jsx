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
import { createUploadLink } from 'apollo-upload-client';
import { actionCreators as modalActionCreators } from 'redux/modules/modal';
import { types as modalTypes } from 'constants/modals';
import { getGraphQLRoot, getApiVersion } from '../config';

const __DEV__ = process.env.NODE_ENV === 'development';

const isObject = node => typeof node === 'object' && node !== null;

const hasFiles = (node, found = []) => {
  Object.keys(node).forEach((key) => {
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
  static propTypes = {
    children: PropTypes.element.isRequired,
    authToken: PropTypes.string.isRequired,
    triggerVersionModal: PropTypes.func.isRequired,
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
    const httpLink = split(
      ({ variables }) => hasFiles(variables),
      createUploadLink(options),
      new BatchHttpLink(options)
    );
    const errorLink = onError(({ graphQLErrors, response, networkError }) => {
      console.log('graphQLErrors', graphQLErrors);
      console.log('networkError', networkError);
      console.log('response', response);
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
      }

      if (networkError) {
        this.props.triggerVersionModal({ name: modalTypes.NEW_API_VERSION });
        console.log(`[Network error]: ${networkError}`);
      }
    });

    const authLink = setContext((_, { headers }) => {
      const { authToken } = this.props;

      return {
        headers: {
          ...headers,
          authorization: authToken ? `Bearer ${authToken}` : undefined,
          'X-CLIENT-Version': getApiVersion(),
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

export default connect(
  ({ auth: { token } }) => ({ authToken: token }),
  { triggerVersionModal: modalActionCreators.open },
)(ApolloProvider);
