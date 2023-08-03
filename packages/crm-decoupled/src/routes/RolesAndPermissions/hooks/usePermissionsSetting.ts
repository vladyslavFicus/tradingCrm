import React, { useState, useCallback } from 'react';
import I18n from 'i18n-js';
import { ActionKey, RbackItem, Actions, Action } from 'types/rbac';
import rbac from 'constants/rbac';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import { useLightbox } from 'providers/LightboxProvider/useLightbox';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { useActionsQuery } from '../graphql/__generated__/ActionsQuery';
import { useDefaultAuthorityQuery } from '../graphql/__generated__/DefaultAuthorityQuery';
import { useUpdateAuthorityActionsMutation } from '../graphql/__generated__/UpdateAuthorityActionsMutation';
import { useResetPermissionMutation } from '../graphql/__generated__/ResetPermissionMutation';

type Props = {
  role: string,
  department: string,
};

const usePermissionsSetting = (props: Props) => {
  const { role, department } = props;

  const [sectionsList, setSectionsList] = useState<RbackItem[]>([]);

  // ===== Image Preview ===== //
  const lightbox = useLightbox();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const getSectionsList = useCallback((authorityActions: Array<string>) => rbac.map((sectionItem) => {
    const section = { ...sectionItem };
    const [actionKey] = Object.keys(section?.actions || {});

    if (actionKey) {
      const sectionAction = section.actions?.[actionKey as ActionKey] as Action;
      sectionAction.state = authorityActions.includes(sectionAction.action);
    }

    const sectionPermissions = section.permissions.map((permissionItem) => {
      const permission = { ...permissionItem };

      Object.keys(permission.actions || {}).forEach((value) => {
        const permissionAction = permission.actions[value as ActionKey] as Action;
        permissionAction.state = authorityActions.includes(permissionAction.action);
      });

      return { ...permission };
    });

    return { ...section, permissions: sectionPermissions };
  }), []);

  // ===== Requests ===== //
  const { data, loading, refetch } = useActionsQuery({
    variables: { role, department },
    onCompleted: ({ authorityActions }) => authorityActions && setSectionsList(getSectionsList(authorityActions)),
    notifyOnNetworkStatusChange: true,
  });

  const defaultAuthorityQuery = useDefaultAuthorityQuery({ variables: { role, department } });
  const isDefaultAuthority = defaultAuthorityQuery.data?.isDefaultAuthority;

  const [updateAuthorityActionsMutation] = useUpdateAuthorityActionsMutation();
  const [resetPermissionMutation] = useResetPermissionMutation();

  // ===== Handlers ===== //
  const handleUpdatePermissions = useCallback(async (actions: Array<string>, isPermitted: boolean) => {
    try {
      await updateAuthorityActionsMutation({ variables: { role, department, actions, isPermitted } });
    } catch {
      refetch();

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.ERROR'),
      });
    }
  }, [role, department, refetch, updateAuthorityActionsMutation]);

  const handleSwitchPermission = useCallback((
    action: string,
    switchSection: RbackItem,
    isSection: boolean,
    enabled: boolean,
  ) => {
    const switchedOffActions: Array<string> = [];

    const [switchSectionActionKey] = Object.keys(switchSection.actions || {});

    const switchSectionAction = switchSection.actions[switchSectionActionKey as ActionKey] as Action;

    const relatedPermissions = (switchSectionAction
      && switchSectionAction.action === action
      && switchSection.additional?.permissions) || [];

    // Sections map
    const list = sectionsList.map((sectionItem) => {
      const section = { ...sectionItem };
      const currentSection = isSection && switchSection.id === section.id;

      const [sectionActionKey] = Object.keys(section.actions || {});

      if (sectionActionKey) {
        const sectionAction = section.actions[sectionActionKey as ActionKey] as Action;

        // When action matched section action
        // Then need to switch section
        if (action === sectionAction.action) {
          sectionAction.state = enabled;
        }

        // When switchSection has related permission, and switch <ON>
        // Then need to switch <ON> matched section
        if (relatedPermissions.includes(sectionAction.action) && enabled) {
          sectionAction.state = enabled;
        }
      }

      // Section permissions map
      const permissions = section.permissions.map((permissionItem) => {
        const permission = { ...permissionItem };

        // Map 'view' & 'edit' action permission
        Object.keys(permission.actions || {}).forEach((key) => {
          const permissionAction = permission.actions[key as ActionKey] as Action;

          // When switchSection has related permission, and switch <ON>
          // Then need to switch <ON> matched permission in any section
          if (relatedPermissions.includes(permissionAction.action) && enabled) {
            permissionAction.state = enabled;
          }

          // When curent section switch and its switch <OFF>
          // Then need switch <OFF> all current section permissions
          if (currentSection && !enabled) {
            switchedOffActions.push(permissionAction.action);
            permissionAction.state = enabled;
          }

          // When action matches to permission action
          // Then need switch
          if (action === permissionAction.action) {
            permissionAction.state = enabled;

            // When permission contains both toggles, and 'View' toggle is switch <OFF>
            // Then 'Edit' toggle should be switch <OFF> too
            if (key === 'view' && !enabled && permission.actions.edit) {
              permission.actions.edit.state = false;

              switchedOffActions.push(permission.actions.edit.action);
            }
          }
        });

        return { ...permission };
      });

      return { ...section, permissions };
    });

    setSectionsList(list);

    handleUpdatePermissions([...switchedOffActions, ...relatedPermissions, action], enabled);
  }, [sectionsList, handleUpdatePermissions]);

  const resetPermission = useCallback(async () => {
    try {
      await resetPermissionMutation({ variables: { role, department } });

      await refetch();

      confirmActionModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.RESET_ERROR'),
      });
    }
  }, [role, department, confirmActionModal, refetch, resetPermissionMutation]);

  const handleResetPermission = useCallback(() => {
    confirmActionModal.show({
      onSubmit: resetPermission,
      modalTitle: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TITLE'),
      actionText: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TEXT'),
      submitButtonLabel: I18n.t('COMMON.RESET'),
    });
  }, [confirmActionModal, resetPermission]);

  const handlePreviewClick = useCallback((e: React.MouseEvent<HTMLDivElement>, actions: Actions) => {
    e.stopPropagation();

    const action = actions.view?.action || actions.edit?.action;

    if (action) {
      try {
        lightbox.show(`/img/rbac/${action}.png`);
      } catch {
        // Do nothing...
      }
    }
  }, [lightbox]);

  return {
    data,
    loading,
    sectionsList,
    isDefaultAuthority,
    handleUpdatePermissions,
    handleSwitchPermission,
    resetPermission,
    handleResetPermission,
    handlePreviewClick,
  };
};

export default usePermissionsSetting;
