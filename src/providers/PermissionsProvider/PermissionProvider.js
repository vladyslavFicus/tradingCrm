import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import Preloader from 'components/Preloader';
import PermissionsQuery from './graphql/PermissionsQuery';

const PermissionContext = React.createContext();

class PermissionProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    permissions: PropTypes.object.isRequired,
  };

  render() {
    const {
      permissions: {
        loading,
        data,
      },
    } = this.props;

    if (loading) {
      return <Preloader isVisible />;
    }

    const value = {
      permission: {
        permissions: get(data, 'permission.data') || [],
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
  set: PropTypes.func.isRequired,
};

export default withRequests({
  permissions: PermissionsQuery,
})(PermissionProvider);
