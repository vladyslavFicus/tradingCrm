import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import { Button } from 'components';
import useClientTradingAccountsTab from '../../hooks/useClientTradingAccountsTab';
import ClientTradingAccountsGridFilter from './components/ClientTradingAccountsGridFilter';
import ClientTradingAccountsGrid from './components/ClientTradingAccountsGrid';
import './ClientTradingAccountsTab.scss';

const ClientTradingAccountsTab = () => {
  const {
    id,
    refetch,
    loading,
    data,
    streamLogins,
    allowCreateTradingAccount,
    handleOpenCreateTradingAccountModal,
  } = useClientTradingAccountsTab();

  return (
    <div className="ClientTradingAccountsTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC')}
        className="ClientTradingAccountsTab__header"
      >
        <If condition={allowCreateTradingAccount}>
          <Button
            data-testid="ClientTradingAccountsTab-addAccountButton"
            onClick={handleOpenCreateTradingAccountModal}
            tertiary
            small
          >
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
          </Button>
        </If>
      </TabHeader>

      <ClientTradingAccountsGridFilter onRefetch={refetch} />

      <ClientTradingAccountsGrid
        profileUUID={id}
        tradingAccounts={data?.clientTradingAccounts || []}
        streamLogins={streamLogins}
        loading={loading}
        onRefetch={refetch}
      />
    </div>
  );
};

export default React.memo(ClientTradingAccountsTab);
