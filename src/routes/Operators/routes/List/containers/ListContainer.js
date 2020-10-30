import { graphql, withApollo, compose } from 'react-apollo';
import { get } from 'lodash';
import { withModals, withNotifications } from 'hoc';
import { managementOperatorsQuery } from 'graphql/queries/operators';
import CreateOperatorModal from 'modals/CreateOperatorModal';
import ExistingOperatorModal from 'modals/ExistingOperatorModal';
import List from '../components/List';

export default compose(
  withApollo,
  withModals({
    createOperator: CreateOperatorModal,
    existingOperator: ExistingOperatorModal,
  }),
  withNotifications,
  graphql(managementOperatorsQuery, {
    name: 'operators',
    options: ({ location: { state } }) => ({
      variables: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          ...{ sorts: state?.sorts },
        },
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ operators: { operators, fetchMore, variables, ...rest } }) => {
      const newPage = get(operators, 'number') || 0;

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
                  page: fetchMoreResult.operators.page,
                  content: [
                    ...previousResult.operators.content,
                    ...fetchMoreResult.operators.content,
                  ],
                },
              };
            },
          }),
        },
      };
    },
  }),
)(List);
