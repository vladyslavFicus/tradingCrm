import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class PermissionLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    permissions: PropTypes.array,
  };
  static defaultProps = {
    permissions: [],
  };
  static childContextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string),
  };

  getChildContext() {
    return {
      permissions: this.props.permissions,
    };
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

const mapStateToProps = state => ({
  permissions: state.permissions.data,
});

export default connect(mapStateToProps)(PermissionLayout);
