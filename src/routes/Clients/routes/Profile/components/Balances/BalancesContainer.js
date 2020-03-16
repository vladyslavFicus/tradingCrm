import { graphql, compose } from 'react-apollo';
import { paymentsStatisticQuery } from 'graphql/queries/statistics';
import { tradingTypes, tradingStatuses } from 'constants/payment';
import { initialQueryParams } from './constants';
import Balances from './Balances';

export default compose(
  graphql(paymentsStatisticQuery, {
    options: ({ uuid, clientRegistrationDate }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.DEPOSIT, tradingStatuses.COMPLETED, clientRegistrationDate),
      },
    }),
    name: 'depositPaymentStatistic',
  }),
  graphql(paymentsStatisticQuery, {
    options: ({ uuid, clientRegistrationDate }) => ({
      variables: {
        playerUUID: uuid,
        ...initialQueryParams(tradingTypes.WITHDRAW, tradingStatuses.COMPLETED, clientRegistrationDate),
      },
    }),
    name: 'withdrawPaymentStatistic',
  }),
)(Balances);
