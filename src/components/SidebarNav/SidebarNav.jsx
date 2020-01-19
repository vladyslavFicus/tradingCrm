import React, { Component } from 'react';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import SidebarNavItem from '../SidebarNavItem';

class Nav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

  checkItemOnPermissions = (item) => {
    const { permission: { permissions: currentPermissions } } = this.props;

    return !(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions);
  };

  getItemsFilteredByPermissions = items => items
    .filter(item => this.checkItemOnPermissions(item))
    .map(item => (
      item.items
        ? {
          ...item,
          items: item.items.filter(innerItem => this.checkItemOnPermissions(innerItem)),
        }
        : item
    ));

  render() {
    const {
      items,
      isSidebarOpen,
    } = this.props;

    const filteredItemsByPermissions = this.getItemsFilteredByPermissions(items);

    return (
      <ul className="nav flex-column">
        {filteredItemsByPermissions.map((item, index) => (
          <If condition={!(item.items && item.items.length === 0)}>
            <SidebarNavItem
              {...item}
              isSidebarOpen={isSidebarOpen}
              key={item.label}
              index={index}
            />
          </If>
        ))}
      </ul>
    );
  }
}


export default withPermission(Nav);
