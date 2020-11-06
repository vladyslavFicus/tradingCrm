import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import PropTypes from 'constants/propTypes';
// import ShortLoader from 'components/ShortLoader';
import ReactSwitch from 'components/ReactSwitch';
import { withRequests } from 'apollo';
import AllActionsQuery from './graphql/AllActionsQuery';
import ActionsQuery from './graphql/ActionsQuery';
import UpdateAuthorityActionsMutation from './graphql/UpdateAuthorityActionsMutation';
import { ReactComponent as PreviewIcon } from './preview-icon.svg';
import mapping from './mapping.json';
import './PermissionsSetting.scss';

class PermissionsSetting extends PureComponent {
  static propTypes = {
    // department: PropTypes.string,
    role: PropTypes.string,
  };

  static defaultProps = {
    // department: null,
    role: null,
  };

  /**
   * Handle switch permission
   *
   * @param action
   * @param enabled
   */
  handleSwitchPermission(enabled) {
    console.log('UUUUU---', enabled);
  }

  renderSettings = actions => (
    <>
      <div className="PermissionsSetting__settings">
        <div className="PermissionsSetting__settings-switcher-view">
          <ReactSwitch
            stopPropagation
            on={actions?.view?.state}
            className="PermissionsSetting__settings-switcher"
            onClick={_enabled => this.handleSwitchPermission(_enabled)}
          />
        </div>
        <div className="PermissionsSetting__settings-switcher-edit">
          <ReactSwitch
            stopPropagation
            on={actions?.edit?.state}
            className="PermissionsSetting__settings-switcher"
            onClick={_enabled => this.handleSwitchPermission(_enabled)}
          />
        </div>
      </div>
      <div className="PermissionsSetting__preview">
        <PreviewIcon />
      </div>
    </>
  );


  render() {
    const {
      role,
    } = this.props;

    return (
      <div className="PermissionsSetting">
        <If condition={role}>
          <div className="PermissionsSetting__title">
            {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
          </div>
        </If>
        <div className="PermissionsSetting__header">
          <div className="PermissionsSetting__header-action-title">
            {I18n.t('ROLES_AND_PERMISSIONS.TABLE.ACTION')}
          </div>
          <div className="PermissionsSetting__header-permissions">
            <div className="PermissionsSetting__header-permissions-title">
              {I18n.t('ROLES_AND_PERMISSIONS.TABLE.PERMISSION')}
            </div>
            <div className="PermissionsSetting__header-permissions-container">
              <div className="PermissionsSetting__header-permissions-view">View</div>
              <div className="PermissionsSetting__header-permissions-edit">Edit</div>
            </div>
          </div>
          <div className="PermissionsSetting__header-preview-title">
            Preview
          </div>
        </div>
        <Accordion className="PermissionsSetting__section" allowZeroExpanded>
          {mapping.sections.map(({ id, permissions }) => (
            <AccordionItem key={id}>
              <AccordionItemHeading>
                <AccordionItemButton className="PermissionsSetting__section-list">
                  <div className="PermissionsSetting__section-title">{ id }</div>
                  {this.renderSettings()}
                </AccordionItemButton>
              </AccordionItemHeading>
              {permissions.map(({ id: title, actions }) => (
                <AccordionItemPanel
                  key={title}
                  className="PermissionsSetting__section-actions cursor-pointer"
                >
                  <div className="PermissionsSetting__section-permission-title">{ title }</div>
                  {this.renderSettings(actions)}
                </AccordionItemPanel>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }
}

export default withRequests({
  allActionsQuery: AllActionsQuery,
  actionsQuery: ActionsQuery,
  updateAuthorityActions: UpdateAuthorityActionsMutation,
})(PermissionsSetting);
