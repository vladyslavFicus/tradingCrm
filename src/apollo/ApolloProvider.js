import React, { PureComponent } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
  createHttpLink,
  split,
  from,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from '@apollo/client/utilities';
import { sha256 } from 'crypto-hash/browser';
import compose from 'compose-function';
import { withRouter } from 'react-router-dom';
import { getGraphQLUrl, getGraphQLSubscriptionUrl, getVersion } from 'config';
import { withModals } from 'hoc';
import { isUpload } from 'apollo/utils/isUpload';
import omitTypename from 'apollo/utils/omitTypename';
import onRefreshToken from 'apollo/utils/onRefreshToken';
import inMemoryCache from 'apollo/utils/inMemoryCache';
import AuthLink from 'apollo/links/AuthLink';
import WebSocketLink from 'apollo/links/WebSocketLink';
import { withStorage } from 'providers/StorageProvider';
import UpdateVersionModal from 'modals/UpdateVersionModal';
import PropTypes from 'constants/propTypes';

class ApolloProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
    modals: PropTypes.shape({
      updateVersionModal: PropTypes.modalType,
    }).isRequired,
  };

  static createClient({ history, storage, modals }) {
    // ========= Batch http link with upload link ========= //
    const httpLinkOptions = {
      uri: getGraphQLUrl(),
    };

    const batchHttpLink = split(
      // Custom link to exclude some queries from batching
      operation => operation.getContext().batch === false,
      createHttpLink(httpLinkOptions),
      new BatchHttpLink(httpLinkOptions),
    );

    const httpLink = split(
      isUpload,
      createUploadLink(httpLinkOptions),
      batchHttpLink,
    );

    const wsLink = new WebSocketLink({
      url: getGraphQLSubscriptionUrl(),
      keepAlive: 20000,
      isFatalConnectionProblem: () => false,
      connectionParams: () => ({
        token: storage.get('token'),
      }),
    });

    const transportLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);

        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    // ========= Error link ========= //
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          // Logging all errors except 401 [UNAUTHENTICATED]
          if (extensions?.code !== 'UNAUTHENTICATED') {
            // eslint-disable-next-line
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          }
        });
      }

      if (networkError) {
        if (networkError.statusCode === 426) {
          modals.updateVersionModal.show();

          return;
        }

        // eslint-disable-next-line
        console.error(`[Network error]: ${networkError}`);
      }
    });

    const createOmitTypenameLink = new ApolloLink((data, forward) => {
      const operation = data;

      if (operation.variables && !operation.variables.file) {
        operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation);
    });

    // ========= Auth link ========= //
    const authLink = new AuthLink({
      uri: getGraphQLUrl(),
      getToken: () => storage.get('token'),
      onRefresh: onRefreshToken(storage),
      onLogout: () => history.push('/logout'),
      headers: {
        'x-client-version': getVersion(),
      },
      skip: ['SignInMutation', 'LogoutMutation'],
    });

    // ========= Persisted query link ========= //
    const persistedQueryLink = createPersistedQueryLink({ sha256 });

    return new ApolloClient({
      link: from([createOmitTypenameLink, authLink, errorLink, persistedQueryLink, transportLink]),
      cache: inMemoryCache,

      // Query deduplication should be turned off because request cancellation not working with turned it on
      // It isn't good way, but no any solution to cancel *-ALL-* pending requests for this time
      // https://github.com/apollographql/apollo-client/issues/4150#issuecomment-487412557
      queryDeduplication: false,
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-only',
          errorPolicy: 'all',
        },
      },
    });
  }

  client = ApolloProvider.createClient(this.props);

  render() {
    const { modals } = this.props;

    if (modals.updateVersionModal.isOpen) {
      return null;
    }

    return (
      <OriginalApolloProvider client={this.client}>
        {this.props.children}
      </OriginalApolloProvider>
    );
  }
}

export default compose(
  withRouter,
  withStorage,
  withModals({ updateVersionModal: UpdateVersionModal }),
)(ApolloProvider);
