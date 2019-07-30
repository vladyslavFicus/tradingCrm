import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import TimelineLite from 'gsap/TimelineLite';
import history from 'router/history';
import SubNav from '../SubNav';
import PropTypes from '../../constants/propTypes';
import './SidebarNavItem.scss';

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

  /**
   * Handle menu item click for prevent animation freezing
   * @param url
   */
  handleMenuItemClick = (url) => {
    this.props.onMenuItemClick();

    setTimeout(() => history.push(url), 300);
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
      <li className="sidebar-nav-item">
        <If condition={withSubmenu}>
          <button
            type="button"
            onClick={() => onToggleTab(index)}
            className="sidebar-nav-item__link"
          >
            <If condition={!!icon}>
              <i className={classNames(icon, 'sidebar-nav-item__icon')} />
            </If>
            <span className="sidebar-nav-item__label">
              {I18n.t(label)}
            </span>
            <If condition={withSubmenu}>
              <i
                ref={node => this.icon = node}
                className="icon-nav-arrow-h sidebar-nav-item__arrow"
              />
            </If>
          </button>
          <SubNav
            ref={node => this.submenu = node}
            items={items}
            onMenuItemClick={onMenuItemClick}
          />
        </If>
        <If condition={!withSubmenu}>
          <div
            className="sidebar-nav-item__link"
            onClick={() => this.handleMenuItemClick(url)}
          >
            <If condition={!!icon}>
              <i className={classNames(icon, 'sidebar-nav-item__icon')} />
            </If>
            <span className="sidebar-nav-item__label">
              {I18n.t(label)}
            </span>
          </div>
        </If>
      </li>
    );
  }
}

export default NavItem;
