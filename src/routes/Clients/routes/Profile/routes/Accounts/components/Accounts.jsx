import React, { PureComponent } from 'react';
import { graphql, compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import EventEmitter, { PROFILE_RELOAD } from 'utils/EventEmitter';
import { profile as profileQuery } from 'graphql/queries/profile';
import { getClientTradingAccounts } from 'graphql/queries/tradingAccount';
import PermissionContent from 'components/PermissionContent';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/UI';
import ClientTradingAccountsGridFilter from './ClientTradingAccountsGridFilter';
import TradingAccountAddModal from './TradingAccountAddModal';
import TradingAccountsGrid from './TradingAccountsGrid';
import '../ClientTradingAccounts.scss';

class Accounts extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
    }).isRequired,
    clientTradingAccountsData: PropTypes.shape({
      clientTradingAccounts: PropTypes.arrayOf(PropTypes.tradingAccount),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    profile: PropTypes.profile.isRequired,
  };

  componentDidMount() {
    EventEmitter.on(PROFILE_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(PROFILE_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.clientTradingAccountsData.refetch();
  };

  showTradingAccountAddModal = () => {
    const {
      modals: { tradingAccountAddModal },
      profile,
      clientTradingAccountsData,
    } = this.props;

    tradingAccountAddModal.show({
      profileId: get(profile, 'profile.uuid'),
      onConfirm: clientTradingAccountsData.refetch,
    });
  };

  render() {
    const {
      profile,
      clientTradingAccountsData,
      clientTradingAccountsData: {
        refetch,
        loading,
      },
    } = this.props;

    const tradingAccounts = get(clientTradingAccountsData, 'clientTradingAccounts') || [];
    const accountType = get(clientTradingAccountsData, 'variables.accountType') || '';
    const profileUuid = get(profile, 'profile.uuid') || '';

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

        <ClientTradingAccountsGridFilter accountType={accountType} />

        <TradingAccountsGrid
          tradingAccounts={tradingAccounts}
          refetchTradingAccountsList={refetch}
          profileUuid={profileUuid}
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
  graphql(getClientTradingAccounts, {
    options: ({
      match: {
        params: {
          id: profileUUID,
        },
      },
      location: { query },
    }) => ({
      variables: {
        accountType: 'LIVE',
        ...query && query.filters,
        profileUUID,
      },
      fetchPolicy: 'network-only',
    }),
    name: 'clientTradingAccountsData',
  }),
  graphql(profileQuery, {
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
    name: 'profile',
  }),
)(Accounts);
