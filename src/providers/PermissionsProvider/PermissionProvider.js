import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import Preloader from 'components/Preloader';
import PermissionsQuery from './graphql/PermissionsQuery';

export const PermissionContext = React.createContext();

class PermissionProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    permissionsQuery: PropTypes.object.isRequired,
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
  getPermissions = () => get(this.props.permissionsQuery.data, 'permission') || [];

  render() {
    const {
      permissionsQuery: {
        loading,
        data,
      },
    } = this.props;

    if (loading && !data?.permission) {
      return <Preloader />;
    }

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

export const PermissionConsumer = PermissionContext.Consumer;

export const PermissionPropTypes = {
  allows: PropTypes.func.isRequired,
  denies: PropTypes.func.isRequired,
};

export default withRequests({
  permissionsQuery: PermissionsQuery,
})(PermissionProvider);
