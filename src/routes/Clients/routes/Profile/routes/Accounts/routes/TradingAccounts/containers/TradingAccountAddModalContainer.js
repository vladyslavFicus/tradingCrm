import { compose, graphql } from 'react-apollo';
import { createTradingAccountMutation } from '../../../../../../../../../graphql/mutations/tradingAccount';
import { withNotifications } from '../../../../../../../../../components/HighOrder';
import TradingAccountAddModal from '../components/TradingAccountAddModal';

export default compose(
  withNotifications,
  graphql(createTradingAccountMutation, { name: 'createTradingAccount' }),
)(TradingAccountAddModal);
