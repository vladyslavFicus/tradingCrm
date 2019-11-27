import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../../../../../components/HighOrder';
import View from '../components/View';
import TradingAccountAddModalContainer from './TradingAccountAddModalContainer';
import TradingAccountChangePasswordModalContainer from './TradingAccountChangePasswordModalContainer';
import { updateTradingAccountMutation } from '../../../../../../../../../graphql/mutations/tradingAccount';

export default compose(
  withModals({
    tradingAccountAddModal: TradingAccountAddModalContainer,
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModalContainer,
  }),
  graphql(updateTradingAccountMutation, { name: 'updateTradingAccount' }),
)(View);
