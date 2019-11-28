import { graphql, compose } from 'react-apollo';
import { withModals } from 'components/HighOrder';
import { getTradingAccount } from 'graphql/queries/tradingAccount';
import { newProfile } from 'graphql/queries/profile';
import { updateTradingAccountMutation } from 'graphql/mutations/tradingAccount';
import View from '../components/View';
import TradingAccountAddModalContainer from './TradingAccountAddModalContainer';
import TradingAccountChangePasswordModalContainer from './TradingAccountChangePasswordModalContainer';

export default compose(
  withModals({
    tradingAccountAddModal: TradingAccountAddModalContainer,
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModalContainer,
  }),
  graphql(updateTradingAccountMutation, { name: 'updateTradingAccount' }),
  graphql(getTradingAccount, {
    options: ({
      match: {
        params: {
          id: uuid,
        },
      },
      location: { query },
    }) => ({
      variables: {
        accountType: 'LIVE',
        ...query && query.filters,
        uuid,
      },
    }),
    name: 'getTradingAccount',
  }),
  graphql(newProfile, {
    options: ({
      match: {
        params: {
          id: playerUUID,
        },
      },
    }) => ({
      variables: {
        playerUUID,
      },
    }),
    name: 'newProfile',
  }),
)(View);
