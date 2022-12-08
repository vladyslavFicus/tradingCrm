import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { orderBy } from 'lodash';
import { withModals } from 'hoc';
import { Modal, State } from 'types';
import { parseErrors } from 'apollo';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import permissions from 'config/permissions';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import { salesStatuses } from 'constants/salesStatuses';
import { retentionStatuses } from 'constants/retentionStatuses';
import { usePermission } from 'providers/PermissionsProvider';
import { Button, TrashButton } from 'components/UI';
import { Table, Column } from 'components/Table';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import AcquisitionStatusesFilter from './components/AcquisitionStatusesFilter';
import NewAcquisitionStatusModal from './modals/NewAcquisitionStatusModal';
import {
  useAcquisitionStatusesQuery,
  AcquisitionStatusesQuery,
  AcquisitionStatusesQueryVariables,
} from './graphql/__generated__/AcquisitionStatusesQuery';
import { useDeleteAcquisitionStatusMutation } from './graphql/__generated__/DeleteAcquisitionStatusMutation';
import './AcquisitionStatuses.scss';

type AcquisitionStatus = ExtractApolloTypeFromArray<AcquisitionStatusesQuery['settings']['acquisitionStatuses']>;

type ConfirmationModalProps = {
  onSubmit: () => void,
  modalTitle: string,
  actionText: string,
  submitButtonLabel: string,
};

type NewAcquisitionStatusModalProps = {
  onSuccess: () => void,
};

type Props = {
  modals: {
    confirmationModal: Modal<ConfirmationModalProps>,
    newAcquisitionStatusModal: Modal<NewAcquisitionStatusModalProps>,
  },
};

const AcquisitionStatuses = (props: Props) => {
  const {
    modals: {
      confirmationModal,
      newAcquisitionStatusModal,
    },
  } = props;

  const { state } = useLocation<State<AcquisitionStatusesQueryVariables['args']>>();
  const permission = usePermission();

  const [deleteAcquisitionStatus] = useDeleteAcquisitionStatusMutation();

  const acquisitionStatusesQuery = useAcquisitionStatusesQuery({
    variables: {
      brandId: getBrand().id,
      args: {
        ...state?.filters,
      },
    },
  });

  const acquisitionStatuses = orderBy(
    acquisitionStatusesQuery.data?.settings.acquisitionStatuses || [],
    ['type', 'status'],
    ['desc', 'asc'],
  );

  // ===== Handlers ===== //
  const handleCreateClick = () => {
    newAcquisitionStatusModal.show({ onSuccess: acquisitionStatusesQuery.refetch });
  };

  const handleDeleteStatus = async (acquisitionStatus: AcquisitionStatus) => {
    try {
      await deleteAcquisitionStatus({
        variables: {
          type: acquisitionStatus.type,
          status: acquisitionStatus.status,
        },
      });

      await acquisitionStatusesQuery.refetch();
      confirmationModal.hide();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SETTINGS.ACQUISITION_STATUSES.NOTIFICATION.DELETE.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      let message = I18n.t('SETTINGS.ACQUISITION_STATUSES.NOTIFICATION.DELETE.FAILED');

      // If clients assigned for this status
      if (error.errorParameters.clients > 0) {
        message = I18n.t('SETTINGS.ACQUISITION_STATUSES.NOTIFICATION.DELETE.HAS_CLIENTS', {
          count: error.errorParameters.clients,
        });
      }

      // If leads assigned for this status
      if (error.errorParameters.leads > 0) {
        message = I18n.t('SETTINGS.ACQUISITION_STATUSES.NOTIFICATION.DELETE.HAS_LEADS', {
          count: error.errorParameters.leads,
        });
      }

      // If CDE rules used this status
      if (error.errorParameters.cdeRules > 0) {
        message = I18n.t('SETTINGS.ACQUISITION_STATUSES.NOTIFICATION.DELETE.HAS_CDE_RULES', {
          count: error.errorParameters.cdeRules,
        });
      }

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message,
      });
    }
  };

  const handleDeleteStatusClick = (acquisitionStatus: AcquisitionStatus) => {
    confirmationModal.show({
      onSubmit: () => handleDeleteStatus(acquisitionStatus),
      modalTitle: I18n.t('SETTINGS.ACQUISITION_STATUSES.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('SETTINGS.ACQUISITION_STATUSES.CONFIRMATION.DELETE.DESCRIPTION', {
        type: I18n.t(`SETTINGS.ACQUISITION_STATUSES.TYPES.${acquisitionStatus.type}`),
        status: acquisitionStatus.type === AcquisitionStatusTypes.SALES
          ? I18n.t(salesStatuses[acquisitionStatus.status])
          : I18n.t(retentionStatuses[acquisitionStatus.status]),
      }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="AcquisitionStatuses">
      <div className="AcquisitionStatuses__header">
        <div>
          <strong>{!acquisitionStatusesQuery.loading && acquisitionStatuses.length}</strong>
          &nbsp;{I18n.t('SETTINGS.ACQUISITION_STATUSES.HEADLINE')}
        </div>
        <If condition={permission.allows(permissions.HIERARCHY.CREATE_ACQUISITION_STATUS)}>
          <div>
            <Button
              onClick={handleCreateClick}
              tertiary
              small
            >
              {I18n.t('SETTINGS.ACQUISITION_STATUSES.ADD_STATUS')}
            </Button>
          </div>
        </If>
      </div>

      <AcquisitionStatusesFilter onRefresh={acquisitionStatusesQuery.refetch} />

      <div className="AcquisitionStatuses">
        <Table
          stickyFromTop={125}
          items={acquisitionStatuses}
          loading={acquisitionStatusesQuery.loading}
          customClassNameRow="AcquisitionStatuses__table-row"
        >
          <Column
            header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.STATUS_NAME')}
            render={({ type, status }: AcquisitionStatus) => (
              <div className="AcquisitionStatuses__text-primary">
                <If condition={type === AcquisitionStatusTypes.SALES}>
                  {I18n.t(salesStatuses[status], { defaultValue: status })}
                </If>
                <If condition={type === AcquisitionStatusTypes.RETENTION}>
                  {I18n.t(retentionStatuses[status], { defaultValue: status })}
                </If>
              </div>
            )}
          />
          <Column
            header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.ACQUISITION')}
            render={({ type }: AcquisitionStatus) => (
              <div className="AcquisitionStatuses__text-primary">
                {I18n.t(`SETTINGS.ACQUISITION_STATUSES.TYPES.${type}`)}
              </div>
            )}
          />
          <If condition={permission.allows(permissions.HIERARCHY.DELETE_ACQUISITION_STATUS)}>
            <Column
              width={120}
              header={I18n.t('SETTINGS.ACQUISITION_STATUSES.GRID.ACTIONS')}
              render={(acquisitionStatus: AcquisitionStatus) => (
                // All "NEW" statuses is non-deletable
                <If condition={acquisitionStatus.status !== 'NEW'}>
                  <TrashButton onClick={() => handleDeleteStatusClick(acquisitionStatus)} />
                </If>
              )}
            />
          </If>
        </Table>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
    newAcquisitionStatusModal: NewAcquisitionStatusModal,
  }),
)(AcquisitionStatuses);
