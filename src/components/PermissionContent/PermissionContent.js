import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqual from '../../utils/shallowEqual';

class PermissionContent extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    permissions: PropTypes.object,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps.permissions.getCompiled(), this.props.permissions.getCompiled()) ||
      !shallowEqual(nextProps.children, this.props.children);
  }

  render() {
    return this.props.permissions.check(this.context.permissions)
      ? this.props.children
      : null;
  }
}

export default PermissionContent;
