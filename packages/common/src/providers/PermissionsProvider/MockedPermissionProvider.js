import React, { PureComponent } from 'react';
import PropTypes from '../../constants/propTypes';
import { PermissionContext } from './PermissionProvider';

class MockedPermissionProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    permissions: PropTypes.array.isRequired,
  };

  /**
   * Determine if the given action should be granted for the current user.
   *
   * @param action
   *
   * @return {*}
   */
  allows = action => this.getPermissions().includes(action);

  /**
   * Determine if the given action should be denied for the current user.
   *
   * @param action
   *
   * @return {*}
   */
  denies = action => !this.allows(action);

  /**
   * Get current permissions list
   *
   * @return {*[]}
   */
  getPermissions = () => this.props.permissions;

  render() {
    const value = {
      permission: {
        permissions: this.getPermissions(),
        allows: this.allows,
        denies: this.denies,
      },
    };

    return (
      <PermissionContext.Provider value={value}>
        {this.props.children}
      </PermissionContext.Provider>
    );
  }
}

export default MockedPermissionProvider;
