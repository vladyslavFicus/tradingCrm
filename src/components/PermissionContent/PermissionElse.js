import { PureComponent } from 'react';
import PropTypes from 'prop-types';

class PermissionElse extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  render() {
    return this.props.children;
  }
}

export default PermissionElse;
