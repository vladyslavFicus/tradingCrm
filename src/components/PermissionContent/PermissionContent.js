import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqual from '../../utils/shallowEqual';

class PermissionContent extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    permissions: PropTypes.object,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !shallowEqual(nextProps.permissions.getCompiled(), this.props.permissions.getCompiled()) ||
      !shallowEqual(nextProps.children, this.props.children);
  }

  render() {
    const { children, permissions } = this.props;
    const { permissions: currentPermissions } = this.context;

    return permissions.check(currentPermissions)
      ? children
      : null;
  }
}

export default PermissionContent;
