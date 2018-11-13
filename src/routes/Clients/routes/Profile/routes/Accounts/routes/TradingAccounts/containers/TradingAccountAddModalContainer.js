import { compose, graphql } from 'react-apollo';
import { get } from 'lodash';
import { tradingAccountOptions } from '../../../../../../../../../graphql/queries/tradingAccount';
import { createTradingAccountMutation } from '../../../../../../../../../graphql/mutations/tradingAccount';
import { withNotifications } from '../../../../../../../../../components/HighOrder';
import TradingAccountAddModal from '../components/TradingAccountAddModal';

export default compose(
  withNotifications,
  graphql(createTradingAccountMutation, { name: 'createTradingAccount' }),
  graphql(tradingAccountOptions, {
    name: 'tradingAccountOptions',
    props: ({ tradingAccountOptions: { options, ...rest } }) => {
      const currencies = get(options, 'tradingAccount.mt4.currencies');

      return {
        currencies,
        ...rest,
      };
    },
  }),
)(TradingAccountAddModal);
