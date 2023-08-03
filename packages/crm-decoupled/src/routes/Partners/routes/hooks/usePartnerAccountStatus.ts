import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps, FormValues } from 'modals/ChangeAccountStatusModal';
import { usePartnerAccountStatusMutation } from '../graphql/__generated__/PartnerAccountStatusMutation';

type Props = {
  uuid: string,
  onRefetch: () => void,
};

type PartnerAccountStatus = {
  allowUpdateAccountStatus: boolean,
  isDropDownOpen: boolean,
  toggleDropdown: () => void,
  handleSelectStatus: (reasons: Record<string, string>, action: string) => void,
};

const usePartnerAccountStatus = (props: Props): PartnerAccountStatus => {
  const {
    uuid,
    onRefetch,
  } = props;

  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const permission = usePermission();

  const allowUpdateAccountStatus = permission.allows(permissions.PARTNERS.UPDATE_STATUS);

  // ===== Requests ===== //
  const [partnerAccountStatusMutation] = usePartnerAccountStatusMutation();

  // ===== Handlers ===== //
  const toggleDropdown = useCallback(() => {
    setIsDropDownOpen(prevIsDropDownOpen => !prevIsDropDownOpen);
  }, []);

  const handleChangeAccountStatus = useCallback(async ({ reason }: FormValues, status: string) => {
    try {
      await partnerAccountStatusMutation({
        variables: {
          uuid,
          status,
          reason,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.SUCCESS.MESSAGE'),
      });

      onRefetch();
      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.CHANGE_ACCOUNT_STATUS.ERROR.MESSAGE'),
      });
    }
  }, [uuid]);

  const handleSelectStatus = useCallback((reasons: Record<string, string>, action: string) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: FormValues) => handleChangeAccountStatus(values, action),
    });
  }, []);

  return {
    isDropDownOpen,
    allowUpdateAccountStatus,
    toggleDropdown,
    handleSelectStatus,
  };
};

export default usePartnerAccountStatus;
