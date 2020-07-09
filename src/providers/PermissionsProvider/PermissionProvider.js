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
    permissionsData: PropTypes.object.isRequired,
  };

  render() {
    const {
      permissionsData: {
        loading,
        data,
      },
    } = this.props;

    if (loading) {
      return <Preloader isVisible />;
    }

    const value = {
      permission: {
        permissions: get(data, 'permission') || [],
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
  permissionsData: PermissionsQuery,
})(PermissionProvider);
