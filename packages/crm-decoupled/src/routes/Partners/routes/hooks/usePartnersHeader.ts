import { useCallback } from 'react';
import { Config, usePermission, useModal } from '@crm/common';
import CreatePartnerModal, { CreatePartnerModalProps } from 'modals/CreatePartnerModal';

const usePartnersHeader = () => {
  const createPartnerModal = useModal<CreatePartnerModalProps>(CreatePartnerModal);

  const permission = usePermission();
  const allowChangeAffiliates = permission.allowsAny([
    Config.permissions.PARTNERS.BULK_CHANGE_AFFILIATES_STATUSES,
    Config.permissions.PARTNERS.BULK_CHANGE_AFFILIATES_COUNTRIES,
  ]);
  const allowCreatePartners = permission.allows(Config.permissions.PARTNERS.CREATE);

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
