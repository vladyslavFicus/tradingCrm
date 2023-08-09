import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { compact } from 'lodash';
import { QueryResult } from '@apollo/client';
import { Config } from '@crm/common';
import { State, TableSelection } from 'types';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { useStorageState, Auth } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import UpdateAcquisitionStatusModal, { UpdateAcquisitionStatusModalProps } from 'modals/UpdateAcquisitionStatusModal';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';
import { ClientsListQuery, ClientsListQueryVariables } from '../graphql/__generated__/ClientsQuery';

type Props = {
  select: TableSelection | null,
  selectedRowsLength: number,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const useClientsBulkActions = (props: Props) => {
  const {
    select = null,
    selectedRowsLength,
    clientsQuery: {
      data,
      refetch,
    },
  } = props;

  const clients = data?.profiles?.content || [];
  const totalElements = data?.profiles?.totalElements || 0;

  const state = useLocation().state as State<ClientsListQueryVariables>;

  // ===== Storage ===== //
  const [{ department }] = useStorageState<Auth>('auth');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowChangeAsquisitionStatus = permission.allows(Config.permissions.USER_PROFILE.CHANGE_ACQUISITION);

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);
  const updateAcquisitionStatusModal = useModal<UpdateAcquisitionStatusModalProps>(UpdateAcquisitionStatusModal);

  // ===== Handlers ===== //
  const handleSubmitSuccess = useCallback(async () => {
    refetch();
    select?.reset();
  }, [refetch, select]);

  const handleTriggerRepModal = useCallback((type: AcquisitionStatusTypes) => () => {
    const uuids = select?.touched ? compact(select?.touched.map(index => clients[index]?.uuid)) : [];

    updateRepresentativeModal.show({
      isClient: true,
      type,
      uuids,
      header: (
        <>
          {I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}

          <div className="ClientsBulkActions__modal-subtitle">
            {selectedRowsLength} {I18n.t('COMMON.CLIENTS_SELECTED')}
          </div>
        </>
      ),
      configs: {
        allRowsSelected: !!select?.all,
        selectedRowsLength,
        multiAssign: true,
        ...(state && {
          searchParams: state.filters || {},
          sorts: state.sorts || [],
        }),
      },
      onSuccess: handleSubmitSuccess,
    });
  }, [
    select, state, clients, selectedRowsLength,
    updateRepresentativeModal, handleSubmitSuccess,
  ]);

  const handleTriggerUpdateAcquisitionStatusModal = useCallback(() => {
    updateAcquisitionStatusModal.show({
      content: clients,
      configs: {
        totalElements,
        selectedRowsLength,
        touchedRowsIds: select?.touched || [],
        allRowsSelected: select?.all || false,
        searchParams: state?.filters || {},
        sorts: state?.sorts || [],
      },
      onSuccess: handleSubmitSuccess,
    });
  }, [
    clients, totalElements, selectedRowsLength, select, state,
    updateAcquisitionStatusModal, handleSubmitSuccess,
  ]);

  return {
    department,
    allowChangeAsquisitionStatus,
    handleTriggerRepModal,
    handleTriggerUpdateAcquisitionStatusModal,
  };
};

export default useClientsBulkActions;
