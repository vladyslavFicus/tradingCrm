/* eslint-disable */

import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { pickBy } from 'lodash';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import ReactSwitch from 'components/ReactSwitch';
import { withRequests } from 'apollo';
import AllActionsQuery from './graphql/AllActionsQuery';
import ActionsQuery from './graphql/ActionsQuery';
import UpdateAuthorityActionsMutation from './graphql/UpdateAuthorityActionsMutation';
import { ReactComponent as PreviewIcon } from './preview-icon.svg';
import mapping from './mapping.json';
import './PermissionsTable.scss';

class PermissionsTable extends PureComponent {
  static propTypes = {
    department: PropTypes.string,
    role: PropTypes.string,
    allActionsQuery: PropTypes.query({ // eslint-disable-line
      allActions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    actionsQuery: PropTypes.query({
      authorityActions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    updateAuthorityActions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    department: null,
    role: null,
  };

  /**
   * Handle switch permission
   *
   * @param action
   * @param enabled
   */
  handleSwitchPermission(action, enabled) {
    const {
      department,
      role,
      updateAuthorityActions,
    } = this.props;

    // Set actual list of actions to state
    this.setState(
      ({ shadowActions }) => ({ shadowActions: { ...shadowActions, [action]: enabled } }),
      async () => {
        const { shadowActions } = this.state;

        // Get only enabled actions
        const actions = Object.keys(shadowActions).filter(_action => shadowActions[_action] === true);

        try {
          // Update actions for authority remotely when state was saved
          await updateAuthorityActions({
            variables: {
              department,
              role,
              actions,
            },
          });
        } catch (e) {
          // Revert changes if something went wrong...
          this.setState(state => ({ shadowActions: { ...state.shadowActions, [action]: !enabled } }));
        }
      },
    );
  }

  renderSettings = (actions) => (
    <>
    <div className="PermissionsSetting__switcher-container">
      <div className="PermissionsSetting__switcher-view">
        <ReactSwitch
          on={actions?.view?.state}
          className="PermissionsSetting__switcher"
          onClick={_enabled => this.handleSwitchPermission(action, _enabled)}
        />
      </div>
      <div className="PermissionsSetting__switcher-edit">
        <ReactSwitch
          on={actions?.edit?.state}
          className="PermissionsSetting__switcher"
          onClick={_enabled => this.handleSwitchPermission(action, _enabled)}
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
          <div className="PermissionsSetting__action">
            {I18n.t('ROLES_AND_PERMISSIONS.TABLE.ACTION')}
          </div>
          <div className="PermissionsSetting__permissions">
            <div className="PermissionsSetting__permissions-title">
              {I18n.t('ROLES_AND_PERMISSIONS.TABLE.PERMISSION')}
            </div>
            <div className="PermissionsSetting__permissions-container">
              <div className="PermissionsSetting__permissions-view">View</div>
              <div className="PermissionsSetting__permissions-edit">Edit</div>
            </div>
          </div>
          <div className="PermissionsSetting__preview-title">
            Preview
          </div>
        </div>
        <Accordion allowZeroExpanded>
          {mapping.sections.map(({ id, permissions }) => (
            <AccordionItem key={id}>
              <AccordionItemHeading>
                <AccordionItemButton className="PermissionsSetting__section-title">
                  <div className="PermissionsSetting__permission-title">{ id }</div>
                  {this.renderSettings()}
                </AccordionItemButton>
              </AccordionItemHeading>
              {permissions.map(({ id, actions }) => (
                <AccordionItemPanel
                  key={id}
                  className="PermissionsSetting__actions cursor-pointer"
                >
                  <div className="PermissionsSetting__permission-title">{ id }</div>
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
})(PermissionsTable);
