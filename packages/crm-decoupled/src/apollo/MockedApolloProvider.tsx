import React from 'react';
import { MockedProvider, MockedProviderProps } from '@apollo/client/testing';
import inMemoryCache from 'apollo/utils/inMemoryCache';

const MockedApolloProvider = (props: MockedProviderProps) => (
  <MockedProvider
    {...props}
    cache={inMemoryCache}
    defaultOptions={{
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-only',
        errorPolicy: 'all',
      },
    }}
  />
);

export default React.memo(MockedApolloProvider);
