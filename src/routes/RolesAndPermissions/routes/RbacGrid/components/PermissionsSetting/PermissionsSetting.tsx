import React, { useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { ActionKey, RbackItem, Actions, Action } from 'types/rbac';
import rbac from 'constants/rbac';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { withImages } from 'components/ImageViewer';
import { Image } from 'components/ImageViewer/types';
import ShortLoader from 'components/ShortLoader';
import ReactSwitch from 'components/ReactSwitch';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { useActionsQuery } from './graphql/__generated__/ActionsQuery';
import { useDefaultAuthorityQuery } from './graphql/__generated__/DefaultAuthorityQuery';
import { useUpdateAuthorityActionsMutation } from './graphql/__generated__/UpdateAuthorityActionsMutation';
import { useResetPermissionMutation } from './graphql/__generated__/ResetPermissionMutation';
import { ReactComponent as PreviewIcon } from './preview-icon.svg';
import './PermissionsSetting.scss';

type Props = {
  images: Image,
  department: string,
  role: string,
  modals: {
    confirmationModal: Modal,
  },
};

const PermissionsSetting = (props: Props) => {
  const { images, department, role, modals: { confirmationModal } } = props;

  const [sectionsList, setSectionsList] = useState<RbackItem[]>([]);

  const getSectionsList = (authorityActions: Array<string>) => rbac.map((sectionItem) => {
    const section = { ...sectionItem };
    const [actionKey] = Object.keys(section?.actions || {});

    const sectionAction = section.actions?.[actionKey as ActionKey] as Action;
    sectionAction.state = authorityActions.includes(sectionAction.action);

    const sectionPermissions = section.permissions.map((permissionItem) => {
      const permission = { ...permissionItem };

      Object.keys(permission.actions || {}).forEach((value) => {
        const permissionAction = permission.actions[value as ActionKey] as Action;
        permissionAction.state = authorityActions.includes(permissionAction.action);
      });

      return { ...permission };
    });

    return { ...section, permissions: sectionPermissions };
  });

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
  const handleUpdatePermissions = async (actions: Array<string>, isPermitted: boolean) => {
    try {
      await updateAuthorityActionsMutation({ variables: { department, role, actions, isPermitted } });
    } catch {
      refetch();

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.ERROR'),
      });
    }
  };

  const handleSwitchPermission = (action: string, switchSection: RbackItem, isSection: boolean, enabled: boolean) => {
    const switchedOffActions: Array<string> = [];

    const [switchSectionActionKey] = Object.keys(switchSection.actions || {});
    const switchSectionAction = switchSection.actions[switchSectionActionKey as ActionKey] as Action;

    const relatedPermissions = (switchSectionAction.action === action && switchSection.additional?.permissions) || [];

    // Sections map
    const list = sectionsList.map((sectionItem) => {
      const section = { ...sectionItem };
      const currentSection = isSection && switchSection.id === section.id;

      const [sectionActionKey] = Object.keys(section.actions || {});
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
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>, actions: Actions) => {
    e.stopPropagation();

    const action = actions.view?.action || actions.edit?.action;

    if (action) {
      try {
        images.show([{ src: `/img/rbac/${action}.png` }]);
      } catch {
        // Do nothing...
      }
    }
  };

  const resetPermission = async () => {
    try {
      await resetPermissionMutation({ variables: { department, role } });

      await refetch();

      confirmationModal.hide();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.RESET_ERROR'),
      });
    }
  };

  const handleResetPermission = () => {
    confirmationModal.show({
      onSubmit: resetPermission,
      modalTitle: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TITLE'),
      actionText: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TEXT'),
      submitButtonLabel: I18n.t('COMMON.RESET'),
    });
  };

  // ===== Renders ===== //
  const renderSwitch = (section: RbackItem, isSection: boolean, action?: Action, isDisabled = false) => {
    if (!action) {
      return null;
    }

    return (
      <ReactSwitch
        stopPropagation
        on={action.state}
        disabled={isDisabled}
        className={classNames('PermissionsSetting__settings-switcher', { 'is-disabled': isDisabled })}
        onClick={enabled => handleSwitchPermission(action.action, section, isSection, enabled)}
      />
    );
  };

  const renderSettings = (actions: Actions, section: RbackItem, isSection: boolean) => {
    const isDisabled = actions?.view && actions?.edit && !actions?.view?.state;

    return (
      <>
        <div className="PermissionsSetting__settings">
          <div className="PermissionsSetting__settings-switcher-view">
            {renderSwitch(section, isSection, actions?.view)}
          </div>

          <div className="PermissionsSetting__settings-switcher-edit">
            {renderSwitch(section, isSection, actions?.edit, isDisabled)}
          </div>
        </div>

        <If condition={actions && section?.image !== false}>
          <div className="PermissionsSetting__preview" onClick={e => handlePreviewClick(e, actions)}>
            <PreviewIcon />
          </div>
        </If>
      </>
    );
  };

  return (
    <div className="PermissionsSetting">
      <div className="PermissionsSetting__panel">
        <div className="PermissionsSetting__panel-title">
          {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
        </div>

        <Button
          className="PermissionsSetting__panel-button-reset"
          tertiary
          disabled={!isDefaultAuthority}
          onClick={handleResetPermission}
        >
          <i className="PermissionsSetting__panel-reset-icon fa fa-refresh" />
          {I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT')}
        </Button>
      </div>

      <div className="PermissionsSetting__header">
        <div className="PermissionsSetting__header-action-title">
          {I18n.t('ROLES_AND_PERMISSIONS.TABLE.ACTION')}
        </div>

        <div className="PermissionsSetting__header-permissions">
          <div className="PermissionsSetting__header-permissions-title">
            {I18n.t('ROLES_AND_PERMISSIONS.TABLE.PERMISSION')}
          </div>

          <div className="PermissionsSetting__header-permissions-container">
            <div className="PermissionsSetting__header-permissions-view">
              {I18n.t('ROLES_AND_PERMISSIONS.TABLE.VIEW')}
            </div>

            <div className="PermissionsSetting__header-permissions-edit">
              {I18n.t('ROLES_AND_PERMISSIONS.TABLE.EDIT')}
            </div>
          </div>
        </div>

        <div className="PermissionsSetting__header-preview-title">
          {I18n.t('ROLES_AND_PERMISSIONS.TABLE.PREVIEW')}
        </div>
      </div>

      <Choose>
        {/* Prevent loading show on refetch query */}
        <When condition={loading && !data?.authorityActions}>
          <ShortLoader />
        </When>

        <Otherwise>
          <Accordion className="PermissionsSetting__section" allowZeroExpanded>
            {sectionsList.map(section => (
              <AccordionItem key={section.id}>
                <AccordionItemHeading>
                  <AccordionItemButton className="PermissionsSetting__section-list">
                    <div className="PermissionsSetting__section-title">
                      {I18n.t(`ROLES_AND_PERMISSIONS.SECTIONS.${section.id}.TITLE`)}
                    </div>

                    {renderSettings(section.actions, section, true)}
                  </AccordionItemButton>
                </AccordionItemHeading>

                {section.permissions.map(permission => (
                  <AccordionItemPanel key={permission.id} className="PermissionsSetting__section-actions">
                    <div className="PermissionsSetting__section-permission-title">
                      {I18n.t(`ROLES_AND_PERMISSIONS.SECTIONS.${section.id}.PERMISSIONS.${permission.id}`)}
                    </div>

                    {renderSettings(permission.actions, section, false)}
                  </AccordionItemPanel>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withImages,
)(PermissionsSetting);
