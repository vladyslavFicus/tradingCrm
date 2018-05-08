import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqual from '../../utils/shallowEqual';
import Permissions, { CONDITIONS } from '../../utils/permissions';

class PermissionContent extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    permissions: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]).isRequired,
    permissionsCondition: PropTypes.oneOf([CONDITIONS.OR, CONDITIONS.AND]),
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    permissionsCondition: CONDITIONS.AND,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      visible: (new Permissions(props.permissions, props.permissionsCondition)).check(context.permissions),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      !shallowEqual(nextProps.permissions, this.props.permissions)
      || !shallowEqual(nextProps.permissionsCondition, this.props.permissionsCondition)
    ) {
      const { permissions: currentPermissions } = this.context;

      this.setState({
        visible: (new Permissions(nextProps.permissions, nextProps.permissionsCondition)).check(currentPermissions),
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.visible !== this.state.visible ||
      !shallowEqual(nextProps.children, this.props.children);
  }

  render() {
    const { visible } = this.state;
    const { children } = this.props;

    return visible ? children : null;
  }
}

export default PermissionContent;
