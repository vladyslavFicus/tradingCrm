import { useCallback } from 'react';
import I18n from 'i18n-js';
import { Config, useStorageState, Auth, usePermission, useModal } from '@crm/common';
import { Profile, AcquisitionStatusTypes__Enum as AcquisitionStatusEnum } from '__generated__/types';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';
import { salesStatusesColor, salesStatuses } from 'constants/salesStatuses';
import { retentionStatusesColor, retentionStatuses } from 'constants/retentionStatuses';

type Props = {
  profile: Profile,
  onRefetch: () => void,
};

const useClientAcquisitionStatus = (props: Props) => {
  const { profile, onRefetch } = props;

  // ===== Storage ===== //
  const [{ department }] = useStorageState<Auth>('auth');

  const { uuid, acquisition } = profile;
  const { salesStatus, salesOperator, retentionStatus, retentionOperator, acquisitionStatus } = acquisition || {};

  // ===== Permissions ===== //
  const permission = usePermission();

  const changeAcquisition = permission.allows(Config.permissions.USER_PROFILE.CHANGE_ACQUISITION);

  const acquisitionItems = {
    SALES: {
      status: salesStatus,
      statusTitle: salesStatuses[salesStatus as string],
      color: salesStatusesColor[salesStatus as string],
      operator: salesOperator,
      availableToUpdate: department !== 'RETENTION',
      isActive: acquisitionStatus === 'SALES',
    },
    RETENTION: {
      status: retentionStatus,
      statusTitle: retentionStatuses[retentionStatus as string],
      color: retentionStatusesColor[retentionStatus as string],
      operator: retentionOperator,
      availableToUpdate: department !== 'SALES',
      isActive: acquisitionStatus === 'RETENTION',
    },
  };

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);

  // ===== Handlers ===== //
  const handleShowModal = useCallback((acquisitionType: AcquisitionStatusEnum, availableToUpdate: boolean) => {
    if (changeAcquisition && availableToUpdate) {
      updateRepresentativeModal.show({
        isClient: true,
        uuid,
        type: acquisitionType,
        header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
          type: acquisitionType.toLowerCase(),
        }),
        onSuccess: onRefetch,
      });
    }
  }, [uuid, changeAcquisition, updateRepresentativeModal, onRefetch]);

  return {
    acquisitionItems,
    handleShowModal,
  };
};

export default useClientAcquisitionStatus;
