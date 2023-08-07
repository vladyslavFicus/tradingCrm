import { useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { permissions } from 'config';
import { State } from 'types';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import CreateTradingAccountModal, { CreateTradingAccountModalProps } from 'modals/CreateTradingAccountModal';
import {
  useTradingAccountsQuery,
  TradingAccountsQueryVariables,
  TradingAccountsQuery,
} from '../graphql/__generated__/TradingAccountsQuery';

type UseClientTradingAccountsTab = {
  id: string,
  refetch: () => void,
  loading: boolean,
  data?: TradingAccountsQuery,
  streamLogins: Array<number>,
  allowCreateTradingAccount: boolean,
  handleOpenCreateTradingAccountModal: () => void,
};

const useClientTradingAccountsTab = (): UseClientTradingAccountsTab => {
  const id = useParams().id as string;

  const state = useLocation().state as State<TradingAccountsQueryVariables>;

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
  const handleOpenCreateTradingAccountModal = useCallback(() => {
    createTradingAccountModal.show({
      profileId: id,
      onSuccess: refetch,
    });
  }, [createTradingAccountModal, id, refetch]);

  return {
    id,
    refetch,
    loading,
    data,
    streamLogins,
    allowCreateTradingAccount,
    handleOpenCreateTradingAccountModal,
  };
};

export default useClientTradingAccountsTab;
