import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { get } from 'lodash';
import moment from 'moment';
import Payments from '../components/Payments';
import { actionCreators as viewActionCreators } from '../modules';
import { actionCreators as playerActionCreators } from '../../../../../modules';
import { withModals } from '../../../../../../../../../components/HighOrder';
import { addPaymentMutation } from '../../../../../../../../../graphql/mutations/payment';
import { getClientPaymentsByUuid } from '../../../../../../../../../graphql/queries/payments';
import PaymentAddModal from '../components/PaymentAddModal';

const mapStateToProps = ({
  userTransactions,
  profile: { profile, playerLimits },
  i18n: { locale },
}) => ({
  ...userTransactions,
  locale,
  currencyCode: profile.data.currencyCode,
  playerProfile: profile.data,
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
  graphql(getClientPaymentsByUuid, {
    name: 'clientPayments',
    options: ({
      match: { params: { id: playerUUID } },
      location: { query },
    }) => ({
      variables: {
        ...query
          ? query.filters
          : { startDate: moment().startOf('day').utc().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) },
        playerUUID,
        page: 0,
        size: 20,
      },
    }),
    props: ({ clientPayments: { clientPaymentsByUuid, fetchMore, ...rest } }) => {
      const newPage = get(clientPaymentsByUuid, 'page') || 0;

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

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientPaymentsByUuid: {
                  ...previousResult.clientPaymentsByUuid,
                  ...fetchMoreResult.clientPaymentsByUuid,
                  content: [
                    ...previousResult.clientPaymentsByUuid.content,
                    ...fetchMoreResult.clientPaymentsByUuid.content,
                  ],
                },
              };
            },
          }),
        },
      };
    },
  }),
)(Payments);
