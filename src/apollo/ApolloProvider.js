import React, { PureComponent } from 'react';
import { ApolloProvider as ReactApolloProvider } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { from, split, ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
import { withStorage } from 'providers/StorageProvider';
import omitTypename from 'graphql/utils/omitTypename';
import PropTypes from 'constants/propTypes';
import queryNames from 'constants/apolloQueryNames';
import { withModals } from 'components/HighOrder';
import UpdateVersionModal from 'components/UpdateVersionModal';
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
    modals: PropTypes.shape({
      updateVersionModal: PropTypes.modalType,
    }).isRequired,
    ...withStorage.propTypes,
  };

  constructor(props) {
    super(props);

    this.constructor.client = this.createClient();
  }

  createClient = () => {
    const { modals: { updateVersionModal } } = this.props;

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

    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          // Suppress next error handlers because sign in and logout can return 401 [UNAUTHENTICATED]
          if (['SignInMutation', 'LogoutMutation'].includes(operation.operationName)) {
            return;
          }

          if (extensions && extensions.code === 'UNAUTHENTICATED') {
            this.props.history.push('/logout');

            return;
          }

          // eslint-disable-next-line
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }

      if (networkError) {
        if (networkError.statusCode === 401) {
          this.props.history.push('/logout');
        }

        if (networkError.statusCode === 426 && !updateVersionModal.isOpen) {
          updateVersionModal.show();
          return;
        }

        // eslint-disable-next-line
        console.log(`[Network error]: ${networkError}`);
      }
    });

    const authLink = setContext((_, { headers }) => {
      const token = this.props.storage.get('token');

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : undefined,
          'X-CLIENT-Version': getApiVersion(),
        },
      };
    });

    const createOmitTypenameLink = new ApolloLink((data, forward) => {
      const operation = data;

      if (operation.variables && !operation.variables.file) {
        operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation);
    });

    const cache = new InMemoryCache({
      dataIdFromObject: (object) => {
        switch (object.__typename) {
          case 'PlayerProfile':
            return object.playerUUID ? `${object.__typename}:${object.playerUUID}` : null;
          case 'HierarchyUserType':
            return object.uuid ? `${object.__typename}:${object.uuid}` : null;
          default:
            return object._id ? `${object.__typename}:${object._id}` : null;
        }
      },
    });

    return new ApolloClient({
      link: from([createOmitTypenameLink, errorLink, authLink, httpLink]),
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

export default withStorage(
  withRouter(
    withModals({ updateVersionModal: UpdateVersionModal })(ApolloProvider),
  ),
);
