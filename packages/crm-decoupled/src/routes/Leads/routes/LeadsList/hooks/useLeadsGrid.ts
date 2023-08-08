import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { NetworkStatus, QueryResult } from '@apollo/client';
import { Config, Utils } from '@crm/common';
import { State, TableSelection } from 'types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { useModal } from 'providers/ModalProvider';
import { Pageable__Lead as PageableLead, Sort__Input as Sort } from '__generated__/types';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { LeadsListQuery, LeadsListQueryVariables } from '../graphql/__generated__/LeadsListQuery';

type Props = {
  leadsQuery: QueryResult<LeadsListQuery>,
  sorts: Array<Sort>,
};

const useLeadsGrid = (props: Props) => {
  const {
    leadsQuery,
    sorts,
  } = props;
  const { data, variables, networkStatus } = leadsQuery;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const state = useLocation().state as State<LeadsListQueryVariables>;
  const navigate = useNavigate();

  const { response } = Utils.limitItems(data?.leads as PageableLead, state);

  const { content = [], totalElements = 0, last = true } = response || {};
  const { currentPage } = Utils.limitItems(data?.leads as PageableLead, state);
  const size = variables?.args?.page?.size;

  const handlePageChanged = useHandlePageChanged({
    query: leadsQuery,
    page: { from: currentPage + 1, size, sorts },
    path: 'args.page',
  });

  const handleSort = useCallback((sort: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts: sort,
      },
    });
  }, [state]);

  const handleRowClick = useCallback((uuid: string) => {
    window.open(`/leads/${uuid}`, '_blank');
  }, []);

  const handleSelectError = useCallback((select: TableSelection) => {
    confirmActionModal.show({
      onSubmit: confirmActionModal.hide,
      modalTitle: `${select.max} ${I18n.t('LEADS.LEADS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  }, []);

  const columnsOrder = Config.getBackofficeBrand()?.tables?.leads?.columnsOrder || [];

  // Show loader only if initial load or new variables was applied
  const isLoading = useMemo(() => (
    [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus)
  ), [networkStatus]);

  return {
    content,
    totalElements,
    last,
    isLoading,
    columnsOrder,
    handlePageChanged,
    handleSort,
    handleRowClick,
    handleSelectError,
  };
};

export default useLeadsGrid;
