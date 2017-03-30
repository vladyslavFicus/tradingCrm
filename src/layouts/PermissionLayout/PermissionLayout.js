import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PermissionLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    permissions: PropTypes.array,
  };

  static childContextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string),
  };

  getChildContext() {
    const {
      permissions,
    } = this.props;

    return {
      permissions,
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  permissions: state.permissions.data,
});

export default connect(mapStateToProps, {})(PermissionLayout);
