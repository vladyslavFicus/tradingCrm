import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set, compact } from 'lodash';
import { Config } from '@crm/common';
import { State } from 'types';
import { Profile, Sort__Input as Sort } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import CreatePaymentModal, { CreatePaymentModalProps } from 'modals/CreatePaymentModal';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { usePermission } from 'providers/PermissionsProvider';
import { statusMapper, statuses } from 'constants/payment';
import { usePaymentsQuery, PaymentsQueryVariables } from '../graphql/__generated__/PaymentsQuery';
import { useProfileQuery } from '../graphql/__generated__/ProfileQuery';

const useClientPaymentsTab = () => {
  const playerUUID = useParams().id as string;

  const state = useLocation().state as State<PaymentsQueryVariables['args']>;

  const navigate = useNavigate();

  const permission = usePermission();

  const allowCreateTransaction = permission.allowsAny([
    Config.permissions.PAYMENT.DEPOSIT,
    Config.permissions.PAYMENT.WITHDRAW,
    Config.permissions.PAYMENT.CREDIT_IN,
    Config.permissions.PAYMENT.CREDIT_OUT,
    Config.permissions.PAYMENT.TRANSFER,
  ]);

  // ===== Modals ===== //
  const createPaymentModal = useModal<CreatePaymentModalProps>(CreatePaymentModal);

  // ===== Requests ===== //
  const profileQuery = useProfileQuery({ variables: { playerUUID } });

  const paymentsQuery = usePaymentsQuery({
    variables: {
      args: {
        ...state?.filters ? state.filters : { accountType: 'LIVE' },
        statuses: state?.filters?.statuses
          ? compact(state?.filters?.statuses).map(item => statusMapper[item as statuses]).flat()
          : undefined,
        profileId: playerUUID,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { data: paymentsData, fetchMore, variables = {} } = paymentsQuery;
  const { content = [], last = false } = paymentsData?.clientPayments || {};

  const { data: profileData } = profileQuery;

  const refetchQueries = useCallback(() => {
    paymentsQuery.refetch();
    profileQuery.refetch();
  }, [paymentsQuery, profileQuery]);

  // ==== Handlers ==== //
  const handleRefetch = useCallback(() => paymentsQuery.refetch(), [paymentsQuery]);

  const handleOpenAddPaymentModal = useCallback(() => {
    createPaymentModal.show({
      onSuccess: refetchQueries,
      profile: profileData?.profile as Profile,
    });
  }, [createPaymentModal, profileData?.profile, refetchQueries]);

  const handleFetchMore = useCallback(() => {
    const page = paymentsQuery?.data?.clientPayments?.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables), 'args.page.from', page + 1),
    });
  }, [fetchMore, paymentsQuery?.data?.clientPayments?.number, variables]);

  const handleSort = useCallback((sorts: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [navigate, state]);

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, handleRefetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, handleRefetch);
    };
  }, []);

  return {
    allowCreateTransaction,
    paymentsLoading: paymentsQuery.loading,
    content,
    last,
    sorts: state?.sorts || [],
    handleOpenAddPaymentModal,
    handleRefetch,
    handleFetchMore,
    handleSort,
  };
};

export default useClientPaymentsTab;
