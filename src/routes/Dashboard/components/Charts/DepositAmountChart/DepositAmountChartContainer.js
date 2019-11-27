import { graphql, compose } from 'react-apollo';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { initialPaymentQueryParams } from '../dashboardChartsUtils';
import DepositAmountChart from './DepositAmountChart';

export default compose(
  graphql(paymentsStatisticQuery, {
    options: () => ({
      variables: {
        ...initialPaymentQueryParams(
          'dateFrom',
          'dateTo',
          {
            paymentType: tradingTypes.DEPOSIT,
            paymentStatus: tradingStatuses.MT4_COMPLETED,
          },
        ),
      },
    }),
    name: 'depositPaymentsStatistic',
  }),
)(DepositAmountChart);
