import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import moment from 'moment';
import { paymentActions, chargebackReasons, rejectReasons } from '../../../../../constants/payment';
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
  paymentActionReasons: {
    [paymentActions.REJECT]: rejectReasons,
    [paymentActions.CHARGEBACK]: chargebackReasons,
  },
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
    skip: ({ auth }) => !(auth.isAdministration || get(auth, 'hierarchyUsers.clients')),
    options: ({
      location: { query },
      auth,
    }) => ({
      variables: {
        ...query
          ? query.filters
          : { startDate: moment().startOf('day').utc().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) },
        page: 0,
        size: 20,
        ...!auth.isAdministration && { playerUUIDs: get(auth, 'hierarchyUsers.clients') },
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

              return {
                ...previousResult,
                ...fetchMoreResult,
                clientPayments: {
                  ...previousResult.clientPayments,
                  ...fetchMoreResult.clientPayments,
                  content: [
                    ...previousResult.clientPayments.content,
                    ...fetchMoreResult.clientPayments.content,
                  ],
                },
              };
            },
          }),
        },
      };
    },
  }),
)(View);
