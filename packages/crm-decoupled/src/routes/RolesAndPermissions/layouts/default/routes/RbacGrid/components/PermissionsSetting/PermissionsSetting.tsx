import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import { Types } from '@crm/common';
import { Button, ShortLoader, ReactSwitch } from 'components';
import usePermissionsSetting from 'routes/RolesAndPermissions/hooks/usePermissionsSetting';
import { ReactComponent as PreviewIcon } from './preview-icon.svg';
import './PermissionsSetting.scss';

type Props = {
  role: string,
  department: string,
};

const PermissionsSetting = (_props: Props) => {
  const { role } = _props;

  const {
    data,
    loading,
    sectionsList,
    isDefaultAuthority,
    handleSwitchPermission,
    handleResetPermission,
    handlePreviewClick,
  } = usePermissionsSetting(_props);

  // ===== Renders ===== //
  const renderSwitch = useCallback((
    section: Types.RbackItem, isSection: boolean, action?: Types.Action, isDisabled = false,
  ) => {
    if (!action) {
      return null;
    }

    return (
      <ReactSwitch
        stopPropagation
        on={action.state}
        disabled={isDisabled}
        className={classNames('PermissionsSetting__settings-switcher', { 'is-disabled': isDisabled })}
        onClick={(enabled: boolean) => handleSwitchPermission(action.action, section, isSection, enabled)}
      />
    );
  }, [handleSwitchPermission]);

  const renderSettings = useCallback((
    actions: Types.Actions, withImage: boolean, section: Types.RbackItem, isSection: boolean,
  ) => {
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

        <If condition={withImage}>
          <div className="PermissionsSetting__preview" onClick={e => handlePreviewClick(e, actions)}>
            <PreviewIcon />
          </div>
        </If>
      </>
    );
  }, [handlePreviewClick, renderSwitch]);

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

                    {renderSettings(section.actions, !section.withoutImage, section, true)}
                  </AccordionItemButton>
                </AccordionItemHeading>

                {section.permissions.map(permission => (
                  <AccordionItemPanel key={permission.id} className="PermissionsSetting__section-actions">
                    <div className="PermissionsSetting__section-permission-title">
                      {I18n.t(`ROLES_AND_PERMISSIONS.SECTIONS.${section.id}.PERMISSIONS.${permission.id}`)}
                    </div>

                    {renderSettings(permission.actions, !permission.withoutImage, section, false)}
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

export default React.memo(PermissionsSetting);
