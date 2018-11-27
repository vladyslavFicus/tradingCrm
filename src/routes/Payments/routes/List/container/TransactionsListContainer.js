import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { departments } from '../../../../../constants/brands';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { getClientPayments } from '../../../../../graphql/queries/payments';
import { actionCreators } from '../modules';
import View from '../components/View';

const mapStateToProps = ({
  transactions,
  i18n: { locale },
  auth: { brandId, uuid, hierarchyUsers, department },
  options: { data: { currencyCodes } },
}) => ({
  ...transactions,
  locale,
  auth: {
    brandId,
    uuid,
    hierarchyUsers,
    isAdministration: department === departments.ADMINISTRATION,
  },
  currencies: currencyCodes,
});

const mapActions = {
  fetchEntities: actionCreators.fetchEntities,
  fetchPlayerMiniProfile: miniProfileActionCreators.fetchPlayerProfile,
  fetchFilters: actionCreators.fetchFilters,
  fetchPlayerProfile: actionCreators.fetchPlayerProfile,
  onChangePaymentStatus: actionCreators.changePaymentStatus,
  loadPaymentStatuses: actionCreators.fetchPaymentStatuses,
  resetAll: actionCreators.resetAll,
  exportEntities: actionCreators.exportEntities,
};

export default compose(
  connect(mapStateToProps, mapActions),
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        page: 0,
        limit: 20,
      },
    }),
    props: ({ clientPayments: { clientPayments, fetchMore, ...rest } }) => {
      const newPage = get(clientPayments, 'number', 0);

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
                    page: fetchMoreResult.clientPayments.page,
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
