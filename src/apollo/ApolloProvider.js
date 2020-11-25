import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createUploadLink } from 'apollo-upload-client';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { onError } from 'apollo-link-error';
import {
  ApolloProvider as OriginalApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  from,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { getGraphQLUrl, getVersion } from 'config';
import { withModals } from 'hoc';
import { isUpload } from 'apollo/utils/isUpload';
import omitTypename from 'apollo/utils/omitTypename';
import onRefreshToken from 'apollo/utils/onRefreshToken';
import AuthLink from 'apollo/links/AuthLink';
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
      new HttpLink(httpLinkOptions),
      new BatchHttpLink(httpLinkOptions),
    );

    const httpLink = split(
      isUpload,
      createUploadLink(httpLinkOptions),
      batchHttpLink,
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
    const persistedQueryLink = createPersistedQueryLink();

    return new ApolloClient({
      link: from([createOmitTypenameLink, authLink, errorLink, persistedQueryLink, httpLink]),
      cache: new InMemoryCache(),

      // Query deduplication should be turned off because request cancellation not working with turned it on
      // It isn't good way, but no any solution to cancel *-ALL-* pending requests for this time
      // https://github.com/apollographql/apollo-client/issues/4150#issuecomment-487412557
      queryDeduplication: false,
    });
  }

  client = this.constructor.createClient(this.props);

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
