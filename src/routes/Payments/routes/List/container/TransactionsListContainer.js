import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import moment from 'moment';
import View from '../components/View';
import { actionCreators } from '../modules';
import { paymentActions, chargebackReasons, rejectReasons } from '../../../../../constants/payment';
import { actionCreators as miniProfileActionCreators } from '../../../../../redux/modules/miniProfile';
import { getClientPayments } from '../../../../../graphql/queries/payments';

const mapStateToProps = ({
  transactions,
  i18n: { locale },
  auth: { brandId, uuid },
  options: { data: { currencyCodes } },
}) => ({
  ...transactions,
  locale,
  paymentActionReasons: {
    [paymentActions.REJECT]: rejectReasons,
    [paymentActions.CHARGEBACK]: chargebackReasons,
  },
  auth: { brandId, uuid },
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
  graphql(getClientPayments, {
    name: 'clientPayments',
    options: ({
      location: { query },
    }) => ({
      variables: {
        ...query ? query.filters : { startDate: moment().startOf('day').utc().format() },
        page: 0,
        size: 20,
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
  connect(mapStateToProps, mapActions)
)(View);
