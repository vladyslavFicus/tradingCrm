import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import Payments from '../components/Payments';
import { actionCreators as viewActionCreators } from '../modules';
import { actionCreators as playerActionCreators } from '../../../../../modules';
import { withModals } from '../../../../../../../../../components/HighOrder';
import { addPaymentMutation } from '../../../../../../../../../graphql/mutations/payment';
import { getClientPaymentsByUuid } from '../../../../../../../../../graphql/queries/payments';
import { operatorsQuery } from '../../../../../../../../../graphql/queries/operators';
import PaymentAddModal from '../components/PaymentAddModal';

const mapStateToProps = ({
  userTransactions,
  profile: { profile, playerLimits },
  auth: { uuid },
  i18n: { locale },
}) => ({
  ...userTransactions,
  locale,
  currencyCode: profile.data.currencyCode,
  playerProfile: profile.data,
  auth: { uuid },
  playerLimits,
});

const mapActions = {
  fetchProfile: playerActionCreators.fetchProfile,
  fetchEntities: viewActionCreators.fetchEntities,
  fetchFilters: viewActionCreators.fetchFilters,
  onChangePaymentStatus: viewActionCreators.changePaymentStatus,
  loadPaymentStatuses: viewActionCreators.fetchPaymentStatuses,
  loadPaymentAccounts: viewActionCreators.fetchPaymentAccounts,
  manageNote: viewActionCreators.manageNote,
  resetNote: viewActionCreators.resetNote,
  resetAll: viewActionCreators.resetAll,
  fetchActiveBonus: viewActionCreators.fetchActiveBonus,
};

export default compose(
  withModals({
    addPayment: PaymentAddModal,
  }),
  connect(mapStateToProps, mapActions),
  graphql(addPaymentMutation, {
    name: 'addPayment',
  }),
  graphql(operatorsQuery, {
    name: 'operators',
    options: () => ({
      variables: {
        size: 2000,
      },
    }),
  }),
  graphql(getClientPaymentsByUuid, {
    name: 'clientPayments',
    options: ({
      match: { params: { id: playerUUID } },
      location: { query },
    }) => ({
      variables: {
        ...query && query.filters,
        playerUUID,
        page: 0,
        limit: 20,
      },
      fetchPolicy: 'network-only',
    }),
    props: ({ clientPayments: { clientPaymentsByUuid, fetchMore, ...rest } }) => {
      const newPage = get(clientPaymentsByUuid, 'data.number', 0);

      return {
        clientPayments: {
          ...rest,
          clientPaymentsByUuid,
          loadMore: () => fetchMore({
            variables: { page: newPage + 1 },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return previousResult;
              }

              if (fetchMoreResult.clientPaymentsByUuid.error) {
                return {
                  ...previousResult,
                  ...fetchMoreResult,
                  clientPaymentsByUuid: {
                    ...previousResult.clientPaymentsByUuid,
                    ...fetchMoreResult.clientPaymentsByUuid,
                  },
                };
              }

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientPaymentsByUuid: {
                  ...previousResult.clientPaymentsByUuid,
                  ...fetchMoreResult.clientPaymentsByUuid,
                  data: {
                    ...previousResult.clientPaymentsByUuid.data,
                    ...fetchMoreResult.clientPaymentsByUuid.data,
                    content: [
                      ...previousResult.clientPaymentsByUuid.data.content,
                      ...fetchMoreResult.clientPaymentsByUuid.data.content,
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
)(Payments);
