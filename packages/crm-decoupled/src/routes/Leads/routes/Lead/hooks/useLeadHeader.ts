import { useCallback } from 'react';
import { Config } from '@crm/common';
import { Lead } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import CreateLeadCallbackModal, { CreateLeadCallbackModalProps } from 'modals/CreateLeadCallbackModal';
import PromoteLeadModal, { PromoteLeadModalProps } from 'modals/PromoteLeadModal';

type Props = {
  lead: Lead,
  onRefetch: () => void,
};

const useLeadHeader = (props: Props) => {
  const { lead, onRefetch } = props;
  const { uuid: userId } = lead;

  // ===== Modals ===== //
  const createLeadCallbackModal = useModal<CreateLeadCallbackModalProps>(CreateLeadCallbackModal);
  const promoteLeadModal = useModal<PromoteLeadModalProps>(PromoteLeadModal);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowCreateCallback = permission.allows(Config.permissions.LEAD_PROFILE.CREATE_CALLBACK);
  const allowAddNote = permission.allows(Config.permissions.NOTES.ADD_NOTE);
  const allowPromoteLead = permission.allows(Config.permissions.LEADS.PROMOTE_LEAD);

  // ===== Handlers ===== //
  // TODO there is a problem with NotePopover
  const handleOpenAddCallbackModal = useCallback(() => {
    createLeadCallbackModal.show({
      userId,
    });
  }, [userId, createLeadCallbackModal]);

  const handleOpenPromoteLeadModal = useCallback(() => {
    promoteLeadModal.show({
      lead,
      onSuccess: onRefetch,
    });
  }, [lead, promoteLeadModal, onRefetch]);

  return {
    allowCreateCallback,
    allowAddNote,
    allowPromoteLead,
    handleOpenAddCallbackModal,
    handleOpenPromoteLeadModal,
  };
};

export default useLeadHeader;
