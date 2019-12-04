import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { getClientPayments } from 'graphql/queries/payments';
import { operatorsQuery } from 'graphql/queries/operators';
import View from '../components/View';

export default compose(
  graphql(operatorsQuery, {
    name: 'operators',
  }),
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: ({
      location: { query },
    }) => ({
      variables: {
        accountType: 'LIVE',
        ...query && query.filters,
        page: 0,
        limit: 20,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ clientPayments: { clientPayments, fetchMore, ...rest } }) => {
      const newPage = get(clientPayments, 'data.number', 0);

      return {
        clientPayments: {
          ...rest,
          clientPayments,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.clientPayments.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  clientPayments: {
                    ...previousResult.clientPayments,
                    ...fetchMoreResult.clientPayments,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientPayments: {
                  ...previousResult.clientPayments,
                  ...fetchMoreResult.clientPayments,
                  data: {
                    ...previousResult.clientPayments.data,
                    ...fetchMoreResult.clientPayments.data,
                    content: [
                      ...previousResult.clientPayments.data.content,
                      ...fetchMoreResult.clientPayments.data.content,
                    ],
                  },
                },
              };
            },
          }),
        },
      };
    },
  }),
)(View);
