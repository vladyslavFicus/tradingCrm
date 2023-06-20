import React from 'react';
import { useLocation } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { compact } from 'lodash';
import { QueryResult } from '@apollo/client';
import { State } from 'types';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import permissions from 'config/permissions';
import { departments } from 'constants/brands';
import { withStorage } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import UpdateAcquisitionStatusModal, { UpdateAcquisitionStatusModalProps } from 'modals/UpdateAcquisitionStatusModal';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';
import { Button } from 'components/Buttons';
import { ClientsListQuery, ClientsListQueryVariables } from '../../graphql/__generated__/ClientsQuery';
import './ClientsBulkActions.scss';

type TableSelection = {
  all: boolean,
  max: number,
  selected: number,
  touched: Array<number>,
  reset: () => void,
};

type Auth = {
  department: string,
  role: string,
  uuid: string,
};

type Props = {
  select?: TableSelection,
  selectedRowsLength: number,
  auth: Auth,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const ClientsBulkActions = (props: Props) => {
  const {
    select = null,
    selectedRowsLength,
    auth: {
      department,
    },
    clientsQuery: {
      data,
      refetch,
    },
  } = props;

  const clients = data?.profiles?.content || [];
  const totalElements = data?.profiles?.totalElements || 0;

  const { state } = useLocation<State<ClientsListQueryVariables>>();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowChangeAsquisitionStatus = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION);

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);
  const updateAcquisitionStatusModal = useModal<UpdateAcquisitionStatusModalProps>(UpdateAcquisitionStatusModal);

  // ===== Handlers ===== //
  const handleSubmitSuccess = async () => {
    refetch();
    select?.reset();
  };

  const handleTriggerRepModal = (type: AcquisitionStatusTypes) => () => {
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
  };

  const handleTriggerUpdateAcquisitionStatusModal = () => {
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
  };

  return (
    <div className="ClientsBulkActions">
      <div className="ClientsBulkActions__title">
        {I18n.t('CLIENTS.BULK_ACTIONS')}
      </div>

      <If condition={allowChangeAsquisitionStatus}>
        <If condition={department !== departments.RETENTION}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            data-testid="ClientsBulkActions-salesButton"
            onClick={handleTriggerRepModal(AcquisitionStatusTypes.SALES)}
          >
            {I18n.t('COMMON.SALES')}
          </Button>
        </If>

        <If condition={department !== departments.SALES}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            data-testid="ClientsBulkActions-retentionButton"
            onClick={handleTriggerRepModal(AcquisitionStatusTypes.RETENTION)}
          >
            {I18n.t('COMMON.RETENTION')}
          </Button>
        </If>

        <Button
          tertiary
          className="ClientsBulkActions__button"
          data-testid="ClientsBulkActions-moveButton"
          onClick={handleTriggerUpdateAcquisitionStatusModal}
        >
          {I18n.t('COMMON.MOVE')}
        </Button>
      </If>
    </div>
  );
};

export default compose(
  React.memo,
  withStorage(['auth']),
)(ClientsBulkActions);
