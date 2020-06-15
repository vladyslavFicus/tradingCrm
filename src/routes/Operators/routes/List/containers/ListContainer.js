import { compose } from 'redux';
import { graphql, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withModals, withNotifications } from 'hoc';
import { createOperator } from 'graphql/mutations/operators';
import { managementOperatorsQuery } from 'graphql/queries/operators';
import CreateOperatorModalContainer from '../components/CreateOperatorModal';
import ExistingOperatorModal from '../components/ExistingOperatorModal';
import List from '../components/List';

export default compose(
  withApollo,
  withModals({
    createOperator: CreateOperatorModalContainer,
    existingOperator: ExistingOperatorModal,
  }),
  withNotifications,
  graphql(createOperator, {
    name: 'submitNewOperator',
  }),
  graphql(managementOperatorsQuery, {
    name: 'operators',
    options: ({ location: { query } }) => ({
      variables: {
        ...query && query.filters,
        page: {
          from: 0,
          size: 20,
          ...query && query.sorts ? { sorts: query.sorts } : { sorts: [] },
        },
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ operators: { operators, fetchMore, variables, ...rest } }) => {
      const newPage = get(operators, 'data.number') || 0;

      return {
        operators: {
          ...rest,
          operators,
          loadMore: () => fetchMore({
            variables: {
              page: {
                ...variables.page,
                from: newPage + 1,
              },
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.operators.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  operators: {
                    ...previousResult.operators,
                    ...fetchMoreResult.operators,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                operators: {
                  ...previousResult.operators,
                  ...fetchMoreResult.operators,
                  data: {
                    ...previousResult.operators.data,
                    ...fetchMoreResult.operators.data,
                    page: fetchMoreResult.operators.data.page,
                    content: [
                      ...previousResult.operators.data.content,
                      ...fetchMoreResult.operators.data.content,
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
)(List);
