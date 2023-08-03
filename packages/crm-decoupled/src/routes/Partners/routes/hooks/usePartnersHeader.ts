import { useCallback } from 'react';
import permissions from 'config/permissions';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import CreatePartnerModal, { CreatePartnerModalProps } from 'modals/CreatePartnerModal';

const usePartnersHeader = () => {
  const createPartnerModal = useModal<CreatePartnerModalProps>(CreatePartnerModal);

  const permission = usePermission();
  const allowChangeAffiliates = permission.allowsAny([
    permissions.PARTNERS.BULK_CHANGE_AFFILIATES_STATUSES, permissions.PARTNERS.BULK_CHANGE_AFFILIATES_COUNTRIES,
  ]);
  const allowCreatePartners = permission.allows(permissions.PARTNERS.CREATE);

  const handleOpenCreatePartnerModal = useCallback(() => {
    createPartnerModal.show();
  }, []);

  return {
    allowChangeAffiliates,
    allowCreatePartners,
    handleOpenCreatePartnerModal,
  };
};

export default usePartnersHeader;
