import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { graphql, withApollo } from 'react-apollo';
import { get } from 'lodash';
import { withModals, withNotifications } from 'hoc';
import { createOperator } from 'graphql/mutations/operators';
import { managementOperatorsQuery } from 'graphql/queries/operators';
import CreateOperatorModalContainer from '../components/CreateOperatorModal';
import ExistingOperatorModal from '../components/ExistingOperatorModal';
import List from '../components/List';

const mapStateToProps = state => ({
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
});

export default compose(
  connect(mapStateToProps, null),
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
        ...query && query.sorts ? { sorts: query.sorts } : {},
        page: 0,
        size: 20,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ operators: { operators, fetchMore, ...rest } }) => {
      const newPage = get(operators, 'data.page') || 0;

      return {
        operators: {
          ...rest,
          operators,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
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
