import { compose, graphql } from 'react-apollo';
import { tradingAccountChangePasswordMutation } from '../../../../../../../../../graphql/mutations/tradingAccount';
import { withNotifications } from '../../../../../../../../../components/HighOrder';
import TradingAccountChangePasswordModal from '../components/TradingAccountChangePasswordModal';

export default compose(
  withNotifications,
  graphql(tradingAccountChangePasswordMutation, { name: 'tradingAccountChangePassword' }),
)(TradingAccountChangePasswordModal);
