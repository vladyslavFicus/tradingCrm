import { useState, useCallback, useMemo } from 'react';
import I18n from 'i18n-js';
import { Config, notify, Types, Constants, useModal, usePermission } from '@crm/common';
import { Profile } from '__generated__/types';
import ChangeAccountStatusModal, { ChangeAccountStatusModalProps, FormValues } from 'modals/ChangeAccountStatusModal';
import { useChangeClientStatusMutation } from '../graphql/__generated__/ChangeClientStatusMutation';

type Props = {
  profile: Profile,
};

const useClientAccountStatus = (props: Props) => {
  const { profile: { uuid, status } } = props;

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateAccountStatus = permission.allows(Config.permissions.USER_PROFILE.STATUS);

  // ===== Modals ===== //
  const changeAccountStatusModal = useModal<ChangeAccountStatusModalProps>(ChangeAccountStatusModal);

  // ===== Requests ===== //
  const [changeClientStatusMutation] = useChangeClientStatusMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues, action: Constants.User.actions) => {
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
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });

      changeAccountStatusModal.hide();
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.TITLE'),
        message: I18n.t('CLIENT_PROFILE.CLIENT.ACCOUNT_STATUS.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  }, [changeAccountStatusModal, changeClientStatusMutation, uuid]);

  const handleSelectStatus = useCallback((reasons: Record<string, string>, action: Constants.User.actions) => {
    changeAccountStatusModal.show({
      reasons,
      onSubmit: (values: FormValues) => handleSubmit(values, action),
      withComment: true,
    });
  }, [changeAccountStatusModal, handleSubmit]);

  const toggleDropdown = useCallback(() => setIsDropDownOpen(prevIsDropDownOpen => !prevIsDropDownOpen), []);

  const statusesOptions = useMemo(() => (
    Constants.User.statusActions[status.type as Constants.User.statuses]
      .filter(action => permission.allows(action.permission))
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
