import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { withModals } from '../../../../../../../../../components/HighOrder';
import { clientQuery } from '../../../../../../../../../graphql/queries/profile';
import View from '../components/View';
import TradingAccountAddModalContainer from './TradingAccountAddModalContainer';
import TradingAccountChangePasswordModalContainer from './TradingAccountChangePasswordModalContainer';

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
    }),
    name: 'playerProfile',
  })
)(View);
