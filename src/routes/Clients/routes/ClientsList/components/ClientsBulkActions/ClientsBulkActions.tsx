import React from 'react';
import { useLocation } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { QueryResult } from '@apollo/client';
import { Modal, State } from 'types';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments } from 'constants/brands';
import { withStorage } from 'providers/StorageProvider';
import { usePermission } from 'providers/PermissionsProvider';
import UpdateAcquisitionStatusModal from 'modals/UpdateAcquisitionStatusModal';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
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

type Modals = {
  representativeUpdateModal: Modal,
  updateAcquisitionStatusModal: Modal,
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
  modals: Modals,
  clientsQuery: QueryResult<ClientsListQuery>,
};

const ClientsBulkActions = (props: Props) => {
  const {
    select = null,
    selectedRowsLength,
    auth: {
      department,
    },
    modals: {
      representativeUpdateModal,
      updateAcquisitionStatusModal,
    },
    clientsQuery: {
      data,
      refetch,
    },
  } = props;

  const permission = usePermission();

  const { state } = useLocation<State<ClientsListQueryVariables>>();
  const clients = data?.profiles?.content || [];
  const totalElements = data?.profiles?.totalElements;

  const onSubmitSuccess = async () => {
    refetch();
    select?.reset();
  };

  const handleTriggerRepModal = (type: string) => () => {
    representativeUpdateModal.show({
      type,
      uuids: select?.touched.map(index => clients[index]?.uuid),
      configs: {
        allRowsSelected: select?.all,
        selectedRowsLength,
        multiAssign: true,
        ...(state && {
          searchParams: state.filters,
          sorts: state.sorts,
        }),
      },
      onSuccess: onSubmitSuccess,
      header: (
        <>
          {I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}

          <div className="ClientsBulkActions__modal-subtitle">
            {selectedRowsLength} {I18n.t('COMMON.CLIENTS_SELECTED')}
          </div>
        </>
      ),
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
      onSuccess: onSubmitSuccess,
    });
  };

  return (
    <div className="ClientsBulkActions">
      <div className="ClientsBulkActions__title">
        {I18n.t('CLIENTS.BULK_ACTIONS')}
      </div>

      <If condition={permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION)}>
        <If condition={department !== departments.RETENTION}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            onClick={handleTriggerRepModal(deskTypes.SALES)}
          >
            {I18n.t('COMMON.SALES')}
          </Button>
        </If>

        <If condition={department !== departments.SALES}>
          <Button
            tertiary
            className="ClientsBulkActions__button"
            onClick={handleTriggerRepModal(deskTypes.RETENTION)}
          >
            {I18n.t('COMMON.RETENTION')}
          </Button>
        </If>

        <Button
          tertiary
          className="ClientsBulkActions__button"
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
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    updateAcquisitionStatusModal: UpdateAcquisitionStatusModal,
  }),
)(ClientsBulkActions);
