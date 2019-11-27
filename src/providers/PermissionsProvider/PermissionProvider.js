import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const PermissionContext = React.createContext();

class PermissionProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);

    this.permissions = {
      set: this.set,
    };
  }

  state = {
    permissions: [],
  }

  /**
   * Set permissions to state
   *
   * @param value
   */
  set = (value) => {
    this.setState({ permissions: value });
  };

  render() {
    const value = {
      permission: {
        ...this.permissions,
        permissions: this.state.permissions,
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

export default PermissionProvider;
