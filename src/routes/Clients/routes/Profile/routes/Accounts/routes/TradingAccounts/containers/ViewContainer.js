import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../../../../../components/HighOrder';
import { clientQuery } from '../../../../../../../../../graphql/queries/profile';
import View from '../components/View';
import TradingAccountAddModalContainer from './TradingAccountAddModalContainer';
import TradingAccountChangePasswordModalContainer from './TradingAccountChangePasswordModalContainer';
import { updateTradingAccountMutation } from '../../../../../../../../../graphql/mutations/tradingAccount';

const mapStateToProps = ({
  i18n: { locale },
}) => ({
  locale,
});

export default compose(
  withModals({
    tradingAccountAddModal: TradingAccountAddModalContainer,
    tradingAccountChangePasswordModal: TradingAccountChangePasswordModalContainer,
  }),
  connect(mapStateToProps),
  graphql(updateTradingAccountMutation, { name: 'updateTradingAccount' }),
  graphql(clientQuery, {
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
      fetchPolicy: 'network-only',
    }),
    name: 'playerProfile',
  })
)(View);
