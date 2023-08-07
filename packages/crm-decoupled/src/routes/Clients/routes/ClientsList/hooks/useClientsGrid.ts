import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NetworkStatus, QueryResult } from '@apollo/client';
import I18n from 'i18n-js';
import { permissions, getBackofficeBrand } from 'config';
import { Pageable, State, TableSelection } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import limitItems from 'utils/limitItems';
import { ProfileView, Sort__Input as Sort } from '__generated__/types';
import { ClientsListQuery, ClientsListQueryVariables } from '../graphql/__generated__/ClientsQuery';

type Props = {
  sorts: Array<Sort>,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const useClientsGrid = (props: Props) => {
  const { sorts, clientsQuery } = props;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const state = useLocation().state as State<ClientsListQueryVariables>;
  const navigate = useNavigate();
  const permission = usePermission();
  const allowAddNote = permission.allows(permissions.NOTES.ADD_NOTE);

  const { data, fetchMore, variables, networkStatus } = clientsQuery;

  const { currentPage, response } = limitItems(data?.profiles as Pageable<ProfileView>, state);

  const handleSort = useCallback((sort: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts: sort,
      },
    });
  }, [navigate, state]);

  const handlePageChanged = useCallback(() => {
    const filters = state?.filters;
    const size = variables?.args?.page?.size;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: currentPage + 1,
            size,
            sorts,
          },
        },
      },
    });
  }, [state?.filters, variables?.args?.page?.size, fetchMore, currentPage, sorts]);

  const handleSelectError = useCallback((select: TableSelection) => {
    confirmActionModal.show({
      onSubmit: confirmActionModal.hide,
      modalTitle: `${select.max} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  }, [confirmActionModal]);

  const isAvailableMultiSelect = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS);
  const isBalanceAvailable = permission.allows(permissions.USER_PROFILE.BALANCE);

  const {
    content = [],
    totalElements = 0,
    last = true,
  } = response;

  // Show loader only if initial load or new variables was applied
  const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus);
  const columnsOrder = getBackofficeBrand()?.tables?.clients?.columnsOrder || [];

  return {
    isAvailableMultiSelect,
    isBalanceAvailable,
    content,
    totalElements,
    last,
    isLoading,
    columnsOrder,
    handleSort,
    handlePageChanged,
    handleSelectError,
    allowAddNote,
  };
};

export default useClientsGrid;
