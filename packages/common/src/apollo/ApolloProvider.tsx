import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as OriginalApolloProvider,
  ServerError,
  createHttpLink,
  split,
  from,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from '@apollo/client/utilities';
import { sha256 } from '../utils';
import { getVersion, getGraphQLUrl, getGraphQLSubscriptionUrl } from '../config';
import { useStorage } from '../providers';
import { UpdateVersionError } from '../components/UpdateVersionError';
import { isUpload } from './utils/isUpload';
import omitTypename from './utils/omitTypename';
import onRefreshToken from './utils/onRefreshToken';
import inMemoryCache from './utils/inMemoryCache';
import AuthLink from './links/AuthLink';
import WebSocketLink from './links/WebSocketLink';

type Props = {
  children: React.ReactNode,
};

const ApolloProvider = (props: Props) => {
  const [isUpdateVersionError, setIsUpdateVersionError] = useState(false);

  // Hook useRef uses here as a crutch, cause useNavigate re-render component while route changed
  // https://github.com/remix-run/react-router/issues/7634
  const navigate = useRef(useNavigate()).current;

  // ===== Storage ===== //
  const storage = useStorage();

  const client = useMemo(() => {
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

    // Make sure your GraphQL upload client sends the 'Apollo-Require-Preflight' header
    // Otherwise Apollo will reject multipart requests to prevent CSRF attacks.
    const httpLink = split(
      isUpload,
      createUploadLink({ ...httpLinkOptions, headers: { 'Apollo-Require-Preflight': 'true' } }) as any,
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
        if ((networkError as ServerError).statusCode === 426) {
          setIsUpdateVersionError(true);

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
      onLogout: () => navigate('/logout'),
      headers: {
        'x-client-version': getVersion(),
      },
      skip: ['SignInMutation', 'LogoutMutation', 'TrackifyMutation'],
    });

    // ========= Persisted query link ========= //
    const persistedQueryLink = createPersistedQueryLink({ sha256 });

    return new ApolloClient({
      link: from([createOmitTypenameLink, authLink, errorLink, persistedQueryLink, transportLink]),
      cache: inMemoryCache,
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-only',
          errorPolicy: 'all',
        },
      },
    });
  }, [storage, navigate]);

  return (
    <Choose>
      <When condition={isUpdateVersionError}>
        <UpdateVersionError />
      </When>

      <Otherwise>
        <OriginalApolloProvider client={client}>
          {props.children}
        </OriginalApolloProvider>
      </Otherwise>
    </Choose>
  );
};

export default React.memo(ApolloProvider);
