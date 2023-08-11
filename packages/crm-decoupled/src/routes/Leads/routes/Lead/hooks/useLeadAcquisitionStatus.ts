import { useCallback } from 'react';
import I18n from 'i18n-js';
import { Config, Constants, usePermission, useModal } from '@crm/common';
import { Lead, AcquisitionStatusTypes__Enum as AcquisitionStatusTypes } from '__generated__/types';
import UpdateRepresentativeModal, { UpdateRepresentativeModalProps } from 'modals/UpdateRepresentativeModal';

type Props = {
  lead: Lead,
  onRefetch?: () => void,
};

const useLeadAcquisitionStatus = (props: Props) => {
  const { lead: { uuid, acquisition }, onRefetch } = props;

  const salesStatus = acquisition?.salesStatus;
  const color = salesStatus && Constants.salesStatusesColor[salesStatus];

  const salesOperator = acquisition?.salesOperator;
  const salesOperatorName = salesOperator?.fullName;

  let teamName = null;
  let deskName = null;

  if (salesOperator) {
    const branches = salesOperator?.hierarchy?.parentBranches;

    const team = branches?.find(branch => branch.branchType === 'TEAM');
    teamName = team?.name;

    const desk = team ? team.parentBranch : branches?.find(branch => branch.branchType === 'DESK');
    deskName = desk?.name;
  }

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowChangeAsquisitionStatus = permission.allows(Config.permissions.USER_PROFILE.CHANGE_ACQUISITION);

  // ===== Modals ===== //
  const updateRepresentativeModal = useModal<UpdateRepresentativeModalProps>(UpdateRepresentativeModal);

  // ===== Handlers ===== //
  const handleChangeAsquisitionStatus = useCallback(() => {
    if (allowChangeAsquisitionStatus) {
      updateRepresentativeModal.show({
        uuid,
        type: AcquisitionStatusTypes.SALES,
        header: I18n.t('LEAD_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', { type: 'Sales' }),
        onSuccess: onRefetch,
      });
    }
  }, [uuid, allowChangeAsquisitionStatus, updateRepresentativeModal, onRefetch]);

  return {
    salesStatus,
    color,
    salesOperatorName,
    teamName,
    deskName,
    handleChangeAsquisitionStatus,
  };
};

export default useLeadAcquisitionStatus;
