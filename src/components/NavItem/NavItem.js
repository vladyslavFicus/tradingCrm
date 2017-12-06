import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router';
import { TimelineLite, Power1 } from 'gsap';
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
    onToggleTab: PropTypes.func,
    onMenuItemClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
  };
  static contextTypes = {
    permissions: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
  };
  static defaultProps = {
    isOpen: null,
    onToggleTab: null,
    icon: '',
    items: [],
    url: '',
  };

  componentDidMount() {
    const { items } = this.props;

    if (items.length) {
      const tl = new TimelineLite({ paused: true });

      const submenuDomNode = findDOMNode(this.submenu);

      tl.fromTo(submenuDomNode, 0.15, { height: 0 }, { height: submenuDomNode.scrollHeight, ease: Power1.easeOut })
        .fromTo(this.icon, 0.15, { rotation: 0 }, { rotation: 180 }, 0)
        .fromTo(submenuDomNode, 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });

      this.tl = tl;
    }
  }

  componentDidUpdate(prevProps) {
    const { isOpen, isSidebarOpen } = this.props;

    if (this.submenu) {
      if ((isOpen && isSidebarOpen) && (!prevProps.isOpen || prevProps.isSidebarOpen === false)) {
        this.tl.play();
      } else if ((prevProps.isOpen && !isOpen) || (prevProps.isSidebarOpen && isSidebarOpen === false)) {
        this.tl.reverse();
      }
    }
  }

  render() {
    const {
      label,
      icon,
      url,
      items,
      onToggleTab,
      index,
      onMenuItemClick,
    } = this.props;

    const { permissions: currentPermissions } = this.context;
    const withSubmenu = items && items.length > 0;
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
      <li className={classNames('nav-item', { dropdown: withSubmenu })}>
        {
          withSubmenu &&
          <span className="nav-link" onClick={() => onToggleTab(index)}>
            {!!icon && <i className={icon} />}
            <span className="nav-link__label">
              {I18n.t(label)}
              {
                withSubmenu &&
                <i
                  ref={node => this.icon = node}
                  className="fa fa-angle-down"
                />
              }
            </span>
          </span>
        }

        {
          !withSubmenu &&
          <Link
            className="nav-link"
            to={url}
            onClick={onMenuItemClick}
          >
            {!!icon && <i className={icon} />}
            <span className="nav-link__label">{I18n.t(label)}</span>
          </Link>
        }

        {
          withSubmenu &&
          <SubNav
            ref={node => this.submenu = node}
            items={subMenu}
            onMenuItemClick={onMenuItemClick}
          />
        }
      </li>
    );
  }
}

export default NavItem;
