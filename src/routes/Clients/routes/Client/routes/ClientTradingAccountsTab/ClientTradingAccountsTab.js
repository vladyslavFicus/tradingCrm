import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import TradingAccountAddModal from 'modals/TradingAccountAddModal';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import ClientTradingAccountsGridFilter from './components/ClientTradingAccountsGridFilter';
import ClientTradingAccountsGrid from './components/ClientTradingAccountsGrid';
import TradingAccountsQuery from './graphql/TradingAccountsQuery';
import './ClientTradingAccountsTab.scss';

class ClientTradingAccountsTab extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
    }).isRequired,
    clientTradingAccountsQuery: PropTypes.query({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.refetchTradingAccounts);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.refetchTradingAccounts);
  }

  refetchTradingAccounts = () => this.props.clientTradingAccountsQuery.refetch();

  showTradingAccountAddModal = () => {
    const {
      match: {
        params: {
          id,
        },
      },
      modals: {
        tradingAccountAddModal,
      },
    } = this.props;

    tradingAccountAddModal.show({
      profileId: id,
      onSuccess: this.refetchTradingAccounts,
    });
  };

  render() {
    const {
      match: {
        params: {
          id,
        },
      },
      clientTradingAccountsQuery,
    } = this.props;


    return (
      <div className="ClientTradingAccountsTab">
        <TabHeader
          title={I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC')}
          className="ClientTradingAccountsTab__header"
        >
          <PermissionContent permissions={permissions.TRADING_ACCOUNT.CREATE}>
            <Button
              data-testid="addAccountButton"
              onClick={this.showTradingAccountAddModal}
              tertiary
              small
            >
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
            </Button>
          </PermissionContent>
        </TabHeader>

        <ClientTradingAccountsGridFilter
          handleRefetch={this.refetchTradingAccounts}
        />

        <ClientTradingAccountsGrid
          profileUUID={id}
          clientTradingAccountsQuery={clientTradingAccountsQuery}
        />
      </div>
    );
  }
}

export default compose(
  withModals({
    tradingAccountAddModal: TradingAccountAddModal,
  }),
  withRequests({
    clientTradingAccountsQuery: TradingAccountsQuery,
  }),
)(ClientTradingAccountsTab);
