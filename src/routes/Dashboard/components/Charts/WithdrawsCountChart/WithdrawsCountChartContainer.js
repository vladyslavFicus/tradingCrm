import { graphql, compose } from 'react-apollo';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { initialPaymentQueryParams } from '../dashboardChartsUtils';
import WithdrawsCountChart from './WithdrawsCountChart';

export default compose(
  graphql(paymentsStatisticQuery, {
    options: () => ({
      variables: {
        ...initialPaymentQueryParams(
          'dateFrom',
          'dateTo',
          {
            paymentType: tradingTypes.WITHDRAW,
            paymentStatus: tradingStatuses.MT4_COMPLETED,
          },
        ),
      },
    }),
    name: 'withdrawPaymentsStatistic',
  }),
)(WithdrawsCountChart);