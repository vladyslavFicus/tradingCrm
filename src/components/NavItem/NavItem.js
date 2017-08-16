import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import Permissions from '../../utils/permissions';
import SubNav from '../SubNav';
import PropTypes from '../../constants/propTypes';

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    url: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem),
    isOpen: PropTypes.bool,
    onToggleMenuItem: PropTypes.func,
    onMenuClick: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
  };
  static defaultProps = {
    isOpen: null,
    onToggleMenuItem: null,
  };

  state = {
    opened: false,
  };

  render() {
    const {
      label,
      icon,
      url,
      items,
      isOpen,
      onToggleMenuItem,
      index,
      onMenuClick,
      isSidebarOpen,
    } = this.props;
    const { permissions: currentPermissions } = this.context;
    const withSubmenu = items && items.length > 0;
    let subMenu = [];
    let currentMenu = false;

    if (!label || (!url && !withSubmenu)) {
      return null;
    }

    if (withSubmenu) {
      subMenu = items.reduce((result, item) => {
        if (!(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions)) {
          result.push(item);
        }

        return result;
      }, []);

      if (!subMenu.length) {
        return null;
      }

      if (subMenu) {
        currentMenu = subMenu.find(subMenuItem => subMenuItem.url === this.context.location.pathname);
      }
    }

    const className = classNames('nav-item', { active: isSidebarOpen && (currentMenu || isOpen), dropdown: withSubmenu });

    return (
      <li className={className}>
        {
          withSubmenu && <span className="nav-link" onClick={() => onToggleMenuItem(index)}>
            {!!icon && <i className={icon} />}
            <span className="nav-link__label">
              {I18n.t(label)}
              {withSubmenu && <i className="fa fa-angle-down" />}
            </span>
          </span>
        }

        {
          !withSubmenu && <Link className="nav-link" to={url} onClick={onMenuClick}>
            {!!icon && <i className={icon} />}
            <span className="nav-link__label">
              {I18n.t(label)}
              {withSubmenu && <i className="fa fa-angle-down" />}
            </span>
          </Link>
        }

        {
          withSubmenu &&
          <SubNav
            items={subMenu}
            onMenuClick={onMenuClick}
          />
        }
      </li>
    );
  }
}

export default NavItem;
