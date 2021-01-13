import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import ClientTradingAccountsGridFilter from './ClientTradingAccountsGridFilter';
import TradingAccountAddModal from './TradingAccountAddModal';
import TradingAccountsGrid from './TradingAccountsGrid';
import TradingAccountsQuery from './graphql/TradingAccountsQuery';
import '../ClientTradingAccountsTab.scss';

class Accounts extends PureComponent {
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
    clientTradingAccountsQuery: PropTypes.shape({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.clientTradingAccountsQuery.refetch();
  };

  showTradingAccountAddModal = () => {
    const {
      match: {
        params: {
          id,
        },
      },
      modals: { tradingAccountAddModal },
      clientTradingAccountsQuery,
    } = this.props;

    tradingAccountAddModal.show({
      profileId: id,
      onConfirm: clientTradingAccountsQuery.refetch,
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
      clientTradingAccountsQuery: {
        refetch,
        loading,
      },
    } = this.props;

    const tradingAccounts = get(clientTradingAccountsQuery, 'data.clientTradingAccounts') || [];

    return (
      <div className="ClientTradingAccounts">
        <TabHeader
          title={I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC')}
          className="ClientTradingAccounts__header"
        >
          <PermissionContent permissions={permissions.TRADING_ACCOUNT.CREATE}>
            <Button
              small
              commonOutline
              onClick={this.showTradingAccountAddModal}
            >
              {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
            </Button>
          </PermissionContent>
        </TabHeader>

        <ClientTradingAccountsGridFilter
          handleRefetch={refetch}
        />

        <TradingAccountsGrid
          tradingAccounts={tradingAccounts}
          refetchTradingAccountsList={refetch}
          profileUuid={id}
          isLoading={loading}
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
)(Accounts);
