import { useState, useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { Profile } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps, FormValues } from 'modals/ChangeAccountStatusModal';
import { statuses, statusActions, actions } from 'constants/user';
import { useChangeClientStatusMutation } from '../graphql/__generated__/ChangeClientStatusMutation';

type Props = {
  profile: Profile,
};

const useClientAccountStatus = (props: Props) => {
  const { profile: { uuid, status } } = props;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateAccountStatus = permission.allows(permissions.USER_PROFILE.STATUS);

  // ===== Modals ===== //
  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

  // ===== Requests ===== //
  const [changeClientStatusMutation] = useChangeClientStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues, action: actions) => {
    try {
      await changeClientStatusMutation({
        variables: {
          uuid,
          status: action,
          reason: values.reason,
          comment: values.comment || null,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  }, [changeAccountStatusModal, changeClientStatusMutation, uuid]);

  const handleSelectStatus = useCallback((reasons: Record<string, string>, action: actions) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: FormValues) => handleSubmit(values, action),
      withComment: true,
    });
  }, [changeAccountStatusModal, handleSubmit]);

  const toggleDropdown = useCallback(() => setIsDropDownOpen(prevIsDropDownOpen => !prevIsDropDownOpen), []);

  const statusesOptions = useMemo(() => (
    statusActions[status.type as statuses].filter(action => permission.allows(action.permission))
  ), [permission, status.type]);

  return {
    isDropDownOpen,
    allowUpdateAccountStatus,
    statusesOptions,
    handleSelectStatus,
    toggleDropdown,
  };
};

export default useClientAccountStatus;
