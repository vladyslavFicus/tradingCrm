import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { cloneDeep, set, compact } from 'lodash';
import { State } from 'types';
import { Profile, Sort__Input as Sort } from '__generated__/types';
import permissions from 'config/permissions';
import { useModal } from 'providers/ModalProvider';
import CreatePaymentModal, { CreatePaymentModalProps } from 'modals/CreatePaymentModal';
import { Button } from 'components/Buttons';
import PaymentsListFilters from 'components/PaymentsListFilters';
import PaymentsListGrid from 'components/PaymentsListGrid';
import TabHeader from 'components/TabHeader';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { statusMapper, statuses } from 'constants/payment';
import { usePermission } from 'providers/PermissionsProvider';
import { usePaymentsQuery, PaymentsQueryVariables } from './graphql/__generated__/PaymentsQuery';
import { useProfileQuery } from './graphql/__generated__/ProfileQuery';
import './ClientPaymentsTab.scss';

const ClientPaymentsTab = () => {
  const { id: playerUUID } = useParams<{ id: string }>();

  const { state } = useLocation<State<PaymentsQueryVariables['args']>>();

  const history = useHistory();

  const permission = usePermission();

  const allowCreateTransaction = permission.allowsAny([
    permissions.PAYMENT.DEPOSIT,
    permissions.PAYMENT.WITHDRAW,
    permissions.PAYMENT.CREDIT_IN,
    permissions.PAYMENT.CREDIT_OUT,
    permissions.PAYMENT.TRANSFER,
    permissions.PAYMENT.COMMISSION,
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

  const refetchQueries = () => {
    paymentsQuery.refetch();
    profileQuery.refetch();
  };

  // ==== Handlers ==== //
  const handleRefetch = () => paymentsQuery.refetch();

  const handleOpenAddPaymentModal = () => {
    createPaymentModal.show({
      onSuccess: refetchQueries,
      profile: profileData?.profile as Profile,
    });
  };

  const handleFetchMore = () => {
    const page = paymentsQuery?.data?.clientPayments?.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Array<Sort>) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, handleRefetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, handleRefetch);
    };
  }, []);

  return (
    <div className="ClientPaymentsTab">
      <TabHeader
        title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.PAYMENTS')}
        className="ClientPaymentsTab__header"
      >
        <If condition={allowCreateTransaction}>
          <Button
            data-testid="addTransactionButton"
            onClick={handleOpenAddPaymentModal}
            tertiary
            small
          >
            {I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION')}
          </Button>
        </If>
      </TabHeader>

      <PaymentsListFilters
        paymentsLoading={paymentsQuery.loading}
        onRefetch={handleRefetch}
        clientView
      />

      <PaymentsListGrid
        items={content}
        loading={paymentsQuery.loading}
        onRefetch={handleRefetch}
        headerStickyFromTop={189}
        last={last}
        sorts={state?.sorts || []}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        clientView
      />
    </div>
  );
};

export default React.memo(ClientPaymentsTab);
