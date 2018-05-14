import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import TimelineLite from 'gsap/TimelineLite';
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
  static defaultProps = {
    isOpen: null,
    onToggleTab: null,
    icon: '',
    items: [],
    url: '',
  };

  componentDidMount() {
    if (this.props.items.length) {
      this.initAnimation();
    }
  }

  componentDidUpdate(prevProps) {
    const { isOpen, isSidebarOpen, items } = this.props;

    if (prevProps.items.length !== items.length) {
      this.initAnimation();
    }

    if (this.submenu) {
      if ((isOpen && isSidebarOpen) && (!prevProps.isOpen || prevProps.isSidebarOpen === false)) {
        this.navItemAnimation.play();
      } else if ((prevProps.isOpen && !isOpen) || (prevProps.isSidebarOpen && isSidebarOpen === false)) {
        this.navItemAnimation.reverse();
      }
    }
  }

  initAnimation = () => {
    const navItemAnimation = new TimelineLite({ paused: true });
    const submenuDomNode = findDOMNode(this.submenu);

    navItemAnimation.fromTo(submenuDomNode, 0.15, { height: 0 }, { height: submenuDomNode.scrollHeight })
      .fromTo(this.icon, 0.15, { rotation: 0 }, { rotation: 180 }, 0)
      .fromTo(submenuDomNode, 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });

    this.navItemAnimation = navItemAnimation;
  };

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

    const withSubmenu = items.length > 0;

    if (!label || (!url && !withSubmenu)) {
      return null;
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
            items={items}
            onMenuItemClick={onMenuItemClick}
          />
        }
      </li>
    );
  }
}

export default NavItem;
