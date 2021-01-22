import React, { PureComponent } from 'react';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import SidebarNavItem from '../SidebarNavItem';
import './SidebarNav.scss';

class SidebarNav extends PureComponent {
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

    return (
      <ul className="SidebarNav">
        {this.getItemsFilteredByPermissions(items).map((item, index) => (
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


export default withPermission(SidebarNav);
