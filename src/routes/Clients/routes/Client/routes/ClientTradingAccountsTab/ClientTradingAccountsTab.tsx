import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { State } from 'types';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import CreateTradingAccountModal, { CreateTradingAccountModalProps } from 'modals/CreateTradingAccountModal';
import TabHeader from 'components/TabHeader';
import { Button } from 'components/Buttons';
import ClientTradingAccountsGridFilter from './components/ClientTradingAccountsGridFilter';
import ClientTradingAccountsGrid from './components/ClientTradingAccountsGrid';
import { useTradingAccountsQuery, TradingAccountsQueryVariables } from './graphql/__generated__/TradingAccountsQuery';
import './ClientTradingAccountsTab.scss';

const ClientTradingAccountsTab = () => {
  const { id } = useParams<{ id: string }>();

  const { state } = useLocation<State<TradingAccountsQueryVariables>>();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCreateTradingAccount = permission.allows(permissions.TRADING_ACCOUNT.CREATE);

  // ===== Requests ===== //
  const { data, loading, refetch } = useTradingAccountsQuery({
    variables: {
      profileUUID: id,
      accountType: 'LIVE',
      ...state && state.filters,
    } as TradingAccountsQueryVariables,
  });

  const tradingAccounts = data?.clientTradingAccounts || [];
  const streamLogins = tradingAccounts.filter(({ platformType }) => platformType === 'WET').map(({ login }) => login);

  // ===== Modals ===== //
  const createTradingAccountModal = useModal<CreateTradingAccountModalProps>(CreateTradingAccountModal);

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
    };
  }, []);

  // ===== Handlers ===== //
  const handleOpenCreateTradingAccountModal = () => {
    createTradingAccountModal.show({
      profileId: id,
      onSuccess: refetch,
    });
  };

  return (
    <div className="ClientTradingAccountsTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.ACCOUNTS.ROUTES.TRADING_ACC')}
        className="ClientTradingAccountsTab__header"
      >
        <If condition={allowCreateTradingAccount}>
          <Button
            data-testid="addAccountButton"
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
        tradingAccounts={tradingAccounts}
        streamLogins={streamLogins}
        loading={loading}
        onRefetch={refetch}
      />
    </div>
  );
};

export default React.memo(ClientTradingAccountsTab);
