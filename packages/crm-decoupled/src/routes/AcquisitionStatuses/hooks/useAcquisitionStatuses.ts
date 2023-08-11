import { useCallback } from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { orderBy } from 'lodash';
import { Config, parseErrors, notify, Types, usePermission, useModal } from '@crm/common';
import { AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import CreateAcquisitionStatusModal, { CreateAcquisitionStatusModalProps } from 'modals/CreateAcquisitionStatusModal';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { retentionStatuses } from 'constants/retentionStatuses';
import { salesStatuses } from 'constants/salesStatuses';
import {
  useAcquisitionStatusesQuery,
  AcquisitionStatusesQuery,
  AcquisitionStatusesQueryVariables,
} from '../graphql/__generated__/AcquisitionStatusesQuery';
import { useDeleteAcquisitionStatusMutation } from '../graphql/__generated__/DeleteAcquisitionStatusMutation';

export type AcquisitionStatus = ExtractApolloTypeFromArray<AcquisitionStatusesQuery['settings']['acquisitionStatuses']>;

type UseAcquisitionStatuses = {
  allowsCreateAcquisitionStatus: boolean,
  allowsDeleteAcquisitionStatus: boolean,
  loading: boolean,
  acquisitionStatuses: Array<AcquisitionStatus>,
  refetch: () => void,
  handleCreateClick: () => void,
  handleDeleteStatusClick: (acquisitionStatus: AcquisitionStatus) => void,
};

const useAcquisitionStatuses = (): UseAcquisitionStatuses => {
  const state = useLocation().state as Types.State<AcquisitionStatusesQueryVariables['args']>;

  const permission = usePermission();

  const allowsCreateAcquisitionStatus = permission.allows(Config.permissions.HIERARCHY.CREATE_ACQUISITION_STATUS);
  const allowsDeleteAcquisitionStatus = permission.allows(Config.permissions.HIERARCHY.DELETE_ACQUISITION_STATUS);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createAcquisitionStatusModal = useModal<CreateAcquisitionStatusModalProps>(CreateAcquisitionStatusModal);

  // ===== Requests ===== //
  const [deleteAcquisitionStatus] = useDeleteAcquisitionStatusMutation();

  const { data, loading, refetch } = useAcquisitionStatusesQuery({
    variables: {
      brandId: Config.getBrand().id,
      args: {
        ...state?.filters,
      },
    },
  });

  const acquisitionStatuses = orderBy(
    data?.settings.acquisitionStatuses || [],
    ['type', 'status'],
    ['desc', 'asc'],
  );

  // ===== Handlers ===== //
  const handleCreateClick = useCallback(() => {
    createAcquisitionStatusModal.show({ onSuccess: refetch });
  }, []);

  const handleDeleteStatus = useCallback(async (acquisitionStatus: AcquisitionStatus) => {
    try {
      await deleteAcquisitionStatus({
        variables: {
          type: acquisitionStatus.type,
          status: acquisitionStatus.status,
        },
      });

      await refetch();
      confirmActionModal.hide();

      notify({
        level: Types.LevelType.SUCCESS,
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
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message,
      });
    }
  }, []);

  const handleDeleteStatusClick = useCallback((acquisitionStatus: AcquisitionStatus) => {
    confirmActionModal.show({
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
  }, []);

  return {
    allowsCreateAcquisitionStatus,
    allowsDeleteAcquisitionStatus,
    loading,
    refetch,
    acquisitionStatuses,
    handleCreateClick,
    handleDeleteStatusClick,
  };
};

export default useAcquisitionStatuses;
