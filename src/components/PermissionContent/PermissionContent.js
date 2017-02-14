import React, { Component, PropTypes } from 'react';

class PermissionContent extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

PermissionContent.propTypes = {
  permissions: PropTypes.object,
};

export default PermissionContent;
