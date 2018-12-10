import { graphql } from 'react-apollo';
import { get } from 'lodash';
import { callbacksQuery } from '../../../../../../graphql/queries/callbacks';
import CallbacksList from './CallbacksList';

export default graphql(callbacksQuery, {
  name: 'callbacks',
  options: ({ location: { query = {} } }) => ({
    variables: {
      ...query.filters,
      page: 0,
      limit: 20,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ callbacks: { callbacks, fetchMore, ...rest } }) => {
    const newPage = get(callbacks, 'data.number', 0);

    return {
      callbacks: {
        ...rest,
        callbacks,
        loadMore: () => fetchMore({
          variables: { page: newPage + 1 },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }

            if (fetchMoreResult.callbacks.error) {
              return {
                ...previousResult,
                ...fetchMoreResult,
                callbacks: {
                  ...previousResult.callbacks,
                  ...fetchMoreResult.callbacks,
                },
              };
            }

            return {
              ...previousResult,
              ...fetchMoreResult,
              callbacks: {
                ...previousResult.callbacks,
                ...fetchMoreResult.callbacks,
                data: {
                  ...previousResult.callbacks.data,
                  ...fetchMoreResult.callbacks.data,
                  page: fetchMoreResult.callbacks.data.page,
                  content: [
                    ...previousResult.callbacks.data.content,
                    ...fetchMoreResult.callbacks.data.content,
                  ],
                },
              },
            };
          },
        }),
      },
    };
  },
})(CallbacksList);
