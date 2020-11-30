import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import rbac from 'constants/rbac';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { withImages } from 'components/ImageViewer';
import ShortLoader from 'components/ShortLoader';
import ReactSwitch from 'components/ReactSwitch';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import ActionsQuery from './graphql/ActionsQuery';
import UpdateAuthorityActionsMutation from './graphql/UpdateAuthorityActionsMutation';
import ResetPermissionMutation from './graphql/ResetPermissionMutation';
import { ReactComponent as PreviewIcon } from './preview-icon.svg';
import './PermissionsSetting.scss';

class PermissionsSetting extends PureComponent {
  static propTypes = {
    ...withImages.propTypes,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    department: PropTypes.string,
    role: PropTypes.string,
    actionsQuery: PropTypes.query({
      authorityActions: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    updateAuthorityActions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    department: null,
    role: null,
  };

  state = {
    shadowActions: null,
    role: null,
    department: null,
    shouldUpdate: false,
  };

  /**
   * Init actions list in state
   *
   * @param props
   * @param state
   *
   * @return {{actions: *}|null}
   */
  static getDerivedStateFromProps(props, state) {
    const { actionsQuery } = props;

    const authorityActions = actionsQuery.data?.authorityActions || [];
    const shouldInit = !actionsQuery.loading
      && (state.department !== props.department || state.role !== props.role);

    if (shouldInit || state.shouldUpdate) {
      const shadowActions = rbac.map((section) => {
        const [sectionKey] = Object.keys(section?.actions || {});
        const _section = { ...section };

        _section.actions[sectionKey].state = authorityActions.includes(section.actions[sectionKey].action);

        return {
          ..._section,
          permissions: _section.permissions.map((permission) => {
            const _permission = { ...permission };

            Object.keys(permission.actions || {}).forEach((value) => {
              _permission
                .actions[value]
                .state = authorityActions.includes(_permission.actions[value].action);
            });

            return { ..._permission };
          }),
        };
      });

      return {
        shadowActions,
        department: props.department,
        role: props.role,
      };
    }

    return {
      shouldUpdate: false,
    };
  }

  /**
   * Handle switch permission
   *
   * @param action
   * @param enabled
   * @param currentSection
   */
  handleSwitchPermission(action, enabled, currentSection) {
    const {
      notify,
      role,
      department,
      actionsQuery: {
        refetch,
      },
      updateAuthorityActions,
    } = this.props;
    const disabledSection = [];

    // Set actual list of actions to state
    this.setState(
      ({ shadowActions }) => ({
        shouldUpdate: false,
        shadowActions: shadowActions.map((section) => {
          if (currentSection && section.id === currentSection.id) {
            const [sectionKey] = Object.keys(section?.actions || {});
            const _section = { ...section };

            _section.actions[sectionKey].state = enabled;

            return {
              ..._section,
              permissions: _section.permissions.map((permission) => {
                const _permission = { ...permission };

                Object.keys(permission.actions || {}).forEach((value) => {
                  const { state } = {
                    ...(enabled && action === _permission.actions[value].action
                      ? { state: enabled }
                      : { state: _permission.actions[value].state }
                    ),
                    ...(!enabled && { state: false }),
                  };

                  if (!enabled) {
                    disabledSection.push(_permission.actions[value].action);
                  }

                  _permission.actions[value].state = state;
                });

                return { ..._permission };
              }),
            };
          }

          return {
            ...section,
            permissions: section.permissions.map((permission) => {
              const _permission = { ...permission };
              const permissionKeys = Object.keys(permission.actions || {});

              permissionKeys.forEach((key) => {
                if (action === _permission.actions[key].action) {
                  _permission.actions[key].state = enabled;

                  /**
                   * If section contains both toggles, and View toggle is turned off,
                   * then Edit toggle should be turned off too.
                   */
                  if (key === 'view' && !enabled && ['view', 'edit'].every(i => permissionKeys.includes(i))) {
                    _permission.actions.edit.state = false;

                    disabledSection.push(_permission.actions.view.action, _permission.actions.edit.action);
                  }
                }
              });

              return { ..._permission };
            }),
          };
        }),
      }),
      async () => {
        try {
          // Update actions for authority remotely when state was saved
          await updateAuthorityActions({
            variables: {
              department,
              role,
              actions: disabledSection.length ? disabledSection : [action],
              isPermitted: enabled,
            },
          });
        } catch {
          this.setState({ shouldUpdate: true }, () => refetch());

          notify({
            level: 'error',
            title: I18n.t('COMMON.ERROR'),
            message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.ERROR'),
          });
        }
      },
    );
  }

  onPreviewClick = (e, actions) => {
    e.stopPropagation();
    const { action } = actions.view || actions.edit;

    try {
      this.props.images.show([{
        // eslint-disable-next-line
        src: require(`./img/${action}.png`).default,
      }]);
    } catch {
      // Do nothing...
    }
  };

  resetPermission = async () => {
    const {
      role,
      department,
      notify,
      modals: {
        confirmationModal,
      },
      actionsQuery: {
        refetch,
      },
      resetPermission,
    } = this.props;

    try {
      await resetPermission({
        variables: {
          department,
          role,
        },
      });

      confirmationModal.hide();

      this.setState({ shouldUpdate: true }, () => refetch());
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('ROLES_AND_PERMISSIONS.UPDATE_PERMISSIONS.RESET_ERROR'),
      });
    }
  }

  handleResetPermission = () => {
    this.props.modals.confirmationModal.show({
      onSubmit: this.resetPermission,
      modalTitle: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TITLE'),
      actionText: I18n.t('ROLES_AND_PERMISSIONS.RESET_TO_DEFAULT_MODAL.TEXT'),
      submitButtonLabel: I18n.t('COMMON.RESET'),
    });
  };

  renderSettings = (actions, section) => {
    const isDisabled = actions?.view && actions?.edit && !actions?.view?.state;

    return (
      <>
        <div className="PermissionsSetting__settings">
          <div className="PermissionsSetting__settings-switcher-view">
            <If condition={actions?.view}>
              <ReactSwitch
                stopPropagation
                on={actions.view.state}
                className="PermissionsSetting__settings-switcher"
                onClick={_enabled => this.handleSwitchPermission(actions.view.action, _enabled, section)}
              />
            </If>
          </div>
          <div className="PermissionsSetting__settings-switcher-edit">
            <If condition={actions?.edit}>
              <ReactSwitch
                stopPropagation
                on={actions.edit.state}
                disabled={isDisabled}
                className={
                  classNames('PermissionsSetting__settings-switcher',
                    { 'is-disabled': isDisabled })
                }
                onClick={_enabled => this.handleSwitchPermission(actions.edit.action, _enabled, section)}
              />
            </If>
          </div>
        </div>
        <div className="PermissionsSetting__preview" onClick={e => this.onPreviewClick(e, actions)}>
          <PreviewIcon />
        </div>
      </>
    );
  }

  render() {
    const {
      role,
      department,
      actionsQuery,
    } = this.props;

    return (
      <div className="PermissionsSetting">
        <div className="PermissionsSetting__panel">
          <div className="PermissionsSetting__panel-title">
            <If condition={role}>
              {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
            </If>
          </div>

          <Button
            className="PermissionsSetting__panel-button-reset"
            commonOutline
            disabled={!department || !role}
            onClick={this.handleResetPermission}
          >
            <i className="padding-right-10 fa fa-refresh" />
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
          <When condition={actionsQuery.loading}>
            <ShortLoader />
          </When>
          <When condition={!department || !role}>
            <div className="text-center margin-20">
              {I18n.t('ROLES_AND_PERMISSIONS.CHOOSE_AN_AUTHORITY')}
            </div>
          </When>
          <Otherwise>
            <Accordion className="PermissionsSetting__section" allowZeroExpanded>
              {this.state.shadowActions.map(section => (
                <AccordionItem key={section.id}>
                  <AccordionItemHeading>
                    <AccordionItemButton className="PermissionsSetting__section-list">
                      <div className="PermissionsSetting__section-title">
                        {I18n.t(`ROLES_AND_PERMISSIONS.SECTIONS.${section.id}.TITLE`)}
                      </div>
                      {this.renderSettings(section?.actions, section)}
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  {section.permissions.map(permission => (
                    <AccordionItemPanel
                      key={permission.id}
                      className="PermissionsSetting__section-actions cursor-pointer"
                    >
                      <div className="PermissionsSetting__section-permission-title">
                        {I18n.t(`ROLES_AND_PERMISSIONS.SECTIONS.${section.id}.PERMISSIONS.${permission.id}`)}
                      </div>
                      {this.renderSettings(permission.actions)}
                    </AccordionItemPanel>
                  ))}
                </AccordionItem>
              ))}
            </Accordion>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withImages,
  withNotifications,
  withRequests({
    actionsQuery: ActionsQuery,
    updateAuthorityActions: UpdateAuthorityActionsMutation,
    resetPermission: ResetPermissionMutation,
  }),
)(PermissionsSetting);
