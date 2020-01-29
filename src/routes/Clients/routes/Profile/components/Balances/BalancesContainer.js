import { graphql, compose } from 'react-apollo';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { initialQueryParams } from './constants';
import Balances from './Balances';

export default compose(
  graphql(paymentsStatisticQuery, {
    options: ({ uuid }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.DEPOSIT, tradingStatuses.MT4_COMPLETED),
      },
    }),
    name: 'depositPaymentStatistic',
  }),
  graphql(paymentsStatisticQuery, {
    options: ({ uuid }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.WITHDRAW, tradingStatuses.MT4_COMPLETED),
      },
    }),
    name: 'withdrawPaymentStatistic',
  }),
)(Balances);
