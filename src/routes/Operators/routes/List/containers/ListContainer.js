import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import { actionCreators as authoritiesActionCreators } from 'redux/modules/auth/authorities';
import { actionCreators as miniProfileActionCreators } from 'redux/modules/miniProfile';
import { createOperator } from 'graphql/mutations/operators';
import { managementOperatorsQuery } from 'graphql/queries/operators';
import { withModals, withNotifications } from 'components/HighOrder';
import CreateOperatorModalContainer from '../components/CreateOperatorModal';
import ExistingOperatorModal from '../components/ExistingOperatorModal';
import List from '../components/List';

const mapStateToProps = ({
  operatorsList: list,
  i18n: { locale },
  auth: { uuid },
  ...state
}) => ({
  list,
  locale,
  operatorId: uuid,
  filterValues: getFormValues('operatorsListGridFilter')(state) || {},
});

const mapActions = {
  fetchOperatorMiniProfile: miniProfileActionCreators.fetchOperatorProfile,
  fetchAuthorities: authoritiesActionCreators.fetchAuthorities,
  fetchAuthoritiesOptions: authoritiesActionCreators.fetchAuthoritiesOptions,
};

export default compose(
  connect(mapStateToProps, mapActions),
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
