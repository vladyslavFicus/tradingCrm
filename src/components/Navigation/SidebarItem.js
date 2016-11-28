import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { stopEvent } from 'utils/helpers';

class SidebarItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      opened: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(e) {
    const { items } = this.props;

    if (!!items && items.length > 0) {
      stopEvent(e);

      this.setState({ opened: !this.state.opened });
    }
  }

  renderSubItems(opened, items, location) {
    const style = { display: opened ? 'block' : null };
    return <ul className="left-menu-list list-unstyled" style={style}>
      {items.map((item, key) => <SidebarItem key={key} location={location} {...item}/>)}
    </ul>;
  }

  render() {
    const { opened } = this.state;
    const { label, icon, items, url, location } = this.props;
    const withSubmenu = !!items && items.length > 0;

    if (!label || !url && !withSubmenu) {
      return null;
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

      {withSubmenu && this.renderSubItems(opened, items, location)}
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
