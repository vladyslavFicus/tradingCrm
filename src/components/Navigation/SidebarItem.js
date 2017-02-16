import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Permissions from 'utils/permissions';
import { stopEvent } from 'utils/helpers';

class SidebarItem extends Component {
  state = {
    opened: false,
  };

  static contextTypes = {
    permissions: PropTypes.array.isRequired,
  };

  handleToggle = (e) => {
    const { items } = this.props;

    if (!!items && items.length > 0) {
      stopEvent(e);

      this.setState({ opened: !this.state.opened });
    }
  };

  renderSubItems(opened, items) {
    const style = { display: opened ? 'block' : null };

    return <ul className="left-menu-list list-unstyled" style={style}>
      {items.map(item => item)}
    </ul>;
  }

  render() {
    const { opened } = this.state;
    const { label, icon, items, url, location } = this.props;
    const { permissions: currentPermissions } = this.context;
    const withSubmenu = !!items && items.length > 0;
    let subMenu = [];

    if (!label || !url && !withSubmenu) {
      return null;
    }

    if (withSubmenu) {
      subMenu = items.reduce((result, item, key) => {
        if (!(item.permissions instanceof Permissions) || item.permissions.check(currentPermissions)) {
          result.push(<SidebarItem key={key} location={location} {...item}/>);
        }

        return result;
      }, []);

      if (!subMenu.length) {
        return null;
      }
    }

    const className = classNames({
      'left-menu-list-active': !!url && location.pathname.indexOf(url) === 0,
      'left-menu-list-submenu': withSubmenu,
      'left-menu-list-opened': withSubmenu && opened,
    });

    return <li className={className}>
      <Link className="left-menu-link" to={url} onClick={this.handleToggle}>
        {icon && <i className={classNames('left-menu-link-icon', icon)}/>}
        {label}
      </Link>

      {withSubmenu && this.renderSubItems(opened, subMenu)}
    </li>;
  }
}

SidebarItem.defaultProps = {
  label: '',
  url: '',
  icon: null,
  items: null,
};
SidebarItem.propTypes = {
  label: PropTypes.string.isRequired,
  url: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default SidebarItem;
