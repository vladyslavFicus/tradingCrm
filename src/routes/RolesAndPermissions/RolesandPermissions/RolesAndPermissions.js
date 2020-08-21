import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import AuthorityOptionsQuery from './graphql/AuthorityOptionsQuery';
import PermissionsTable from '../components/PermissionsTable';
import './RolesAndPermissions.scss';

class RolesAndPermissions extends PureComponent {
  static propTypes = {
    authoritiesQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
  };

  state = {
    department: null,
    role: null,
  };

  /**
   * Handle select authority to show actions
   *
   * @param department
   * @param role
   */
  handleSelectAuthority = (department, role) => {
    this.setState({ department, role });
  };

  render() {
    const { authoritiesQuery } = this.props;

    const { department: activeDepartment, role: activeRole } = this.state;

    const authorities = authoritiesQuery.data?.authoritiesOptions || {};

    return (
      <div className="RolesAndPermissions">
        <div className="RolesAndPermissions__header">
          <div className="RolesAndPermissions__title">{I18n.t('ROLES_AND_PERMISSIONS.TITLE')}</div>
        </div>
        <div className="RolesAndPermissions__content">
          <Choose>
            <When condition={authoritiesQuery.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <div className="RolesAndPermissions__authorities">
                {Object.entries(authorities).map(([department, roles]) => (
                  <div className="RolesAndPermissions__authority-wrapper" key={department}>
                    <div className="RolesAndPermissions__authority-title">
                      {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`)}
                    </div>
                    {roles.map(role => (
                      <div
                        key={`${department}-${role}`}
                        onClick={() => this.handleSelectAuthority(department, role)}
                        className={
                          classNames(
                            'RolesAndPermissions__authority', {
                              'RolesAndPermissions__authority--active': activeDepartment === department
                               && activeRole === role,
                            },
                          )}
                      >
                        {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="RolesAndPermissions__permissions">
                <PermissionsTable department={activeDepartment} role={activeRole} />
              </div>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default withRequests({
  authoritiesQuery: AuthorityOptionsQuery,
})(RolesAndPermissions);
