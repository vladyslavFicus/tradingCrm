import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { pickBy } from 'lodash';
import PropTypes from 'constants/propTypes';
import Select from 'components/Select';
import ShortLoader from 'components/ShortLoader';
import ReactSwitch from 'components/ReactSwitch';
import { withRequests } from 'apollo';
import AllActionsQuery from './graphql/AllActionsQuery';
import ActionsQuery from './graphql/ActionsQuery';
import UpdateAuthorityActionsMutation from './graphql/UpdateAuthorityActionsMutation';
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

  state = {
    filter: 'all',

    // Used for rendering actions (the main problem is change enabled with filter)
    // If filter is 'Enabled' and you change permission to disable -> permission lost from list depends on filter
    actions: null,

    // Used to enable/disable actions under the hood
    shadowActions: null,

    role: null,
    department: null,
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
    const { allActionsQuery, actionsQuery } = props;

    const authorityActions = actionsQuery.data?.authorityActions || [];
    const allActions = allActionsQuery.data?.allActions || [];

    const shouldInit = (!actionsQuery.loading && !allActionsQuery.loading)
      && (state.department !== props.department || state.role !== props.role);

    if (shouldInit) {
      const actions = allActions.reduce((acc, curr) => ({ ...acc, [curr]: authorityActions.includes(curr) }), {});

      return {
        actions,
        shadowActions: actions,
        department: props.department,
        role: props.role,
      };
    }

    return null;
  }

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

  /**
   * Handle enabled/disabled/all filter
   */
  handleSelectFilter = (filter) => {
    this.setState(({ shadowActions }) => ({ filter, actions: shadowActions }));
  };

  /**
   * Get list of actions depends on filter
   *
   * @return {*|*[]}
   */
  getAllActionsList() {
    const { filter, actions } = this.state;

    // Get empty object if actions not defined yet
    if (!actions) {
      return {};
    }

    // Get only enabled actions
    if (filter === 'enabled') {
      return pickBy(actions);
    }

    // Get only disabled actions
    if (filter === 'disabled') {
      return pickBy(actions, enabled => !enabled);
    }

    // Get all actions
    return actions;
  }


  render() {
    const {
      department,
      role,
      actionsQuery,
    } = this.props;

    const { filter, shadowActions } = this.state;

    const actions = this.getAllActionsList();

    return (
      <div className="PermissionsTable">
        <div className="PermissionsTable__filters">
          <Select value={filter} onChange={this.handleSelectFilter}>
            <option key={0} value="all">
              {I18n.t('ROLES_AND_PERMISSIONS.SELECT_FILTER.ALL')}
            </option>
            <option key={1} value="enabled">
              {I18n.t('ROLES_AND_PERMISSIONS.SELECT_FILTER.ENABLED')}
            </option>
            <option key={2} value="disabled">
              {I18n.t('ROLES_AND_PERMISSIONS.SELECT_FILTER.DISABLED')}
            </option>
          </Select>
        </div>
        <table>
          <thead>
            <tr>
              <th>{I18n.t('ROLES_AND_PERMISSIONS.TABLE.ACTION')}</th>
              <th>{I18n.t('ROLES_AND_PERMISSIONS.TABLE.PERMISSION')}</th>
            </tr>
          </thead>
          <tbody>
            <Choose>
              <When condition={actionsQuery.loading}>
                <tr>
                  <td colSpan={2}>
                    <ShortLoader />
                  </td>
                </tr>
              </When>
              <When condition={!department || !role}>
                <tr>
                  <td className="PermissionsTable__align-center" colSpan={2}>
                    {I18n.t('ROLES_AND_PERMISSIONS.CHOOSE_AN_AUTHORITY')}
                  </td>
                </tr>
              </When>
              <Otherwise>
                {Object.keys(actions).map(action => (
                  <tr key={action}>
                    <td>{action}</td>
                    <td className="PermissionsTable__align-center">
                      <ReactSwitch
                        on={shadowActions[action]}
                        className="PermissionsTable__switcher"
                        onClick={_enabled => this.handleSwitchPermission(action, _enabled)}
                      />
                    </td>
                  </tr>
                ))}
              </Otherwise>
            </Choose>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRequests({
  allActionsQuery: AllActionsQuery,
  actionsQuery: ActionsQuery,
  updateAuthorityActions: UpdateAuthorityActionsMutation,
})(PermissionsTable);
