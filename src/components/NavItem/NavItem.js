import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import Permissions from '../../utils/permissions';
import SubNav from '../SubNav';
import PropTypes from '../../constants/propTypes';

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    url: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem),
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  state = {
    opened: false,
  };

  handleDropDownClick = () => {
    this.setState({ opened: !this.state.opened });
  };

  render() {
    const {
      label,
      icon,
      url,
      items,
    } = this.props;
    const { permissions: currentPermissions } = this.context;
    const withSubmenu = items && items.length > 0;
    const className = classNames('nav-item', { active: this.state.opened, dropdown: withSubmenu });
    let subMenu = [];

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
    }

    return (
      <li className={className} onClick={this.handleDropDownClick}>
        <Link className="nav-link" to={url}>
          {!!icon && <i className={icon} />}
          <span className="nav-link__label">
            {I18n.t(label)}
            {withSubmenu && <i className="fa fa-angle-down" />}
          </span>
        </Link>

        {
          withSubmenu &&
          <SubNav
            items={subMenu}
          />
        }
      </li>
    );
  }
}

export default NavItem;
