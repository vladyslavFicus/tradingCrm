import { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions, { CONDITIONS } from 'utils/permissions';
import PermissionElse from './PermissionElse';

class PermissionContent extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
    permissions: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]).isRequired,
    permission: PropTypes.permission.isRequired,
    permissionsCondition: PropTypes.oneOf([CONDITIONS.OR, CONDITIONS.AND]),
  };

  static defaultProps = {
    permissionsCondition: CONDITIONS.AND,
    children: null,
  };

  static getDerivedStateFromProps(props) {
    return {
      visible: (new Permissions(props.permissions, props.permissionsCondition)).check(props.permission.permissions),
    };
  }

  state = {
    visible: (new Permissions(this.props.permissions, this.props.permissionsCondition))
      .check(this.props.permission.permissions),
  };

  render() {
    const { visible } = this.state;
    const { children } = this.props;

    if (!Array.isArray(children)) {
      return visible ? children : null;
    }

    const permissionContent = children.filter(item => item?.type !== PermissionElse);
    const permissionElse = children.filter(item => item?.type === PermissionElse);

    return visible ? permissionContent : permissionElse;
  }
}

export default withPermission(PermissionContent);
