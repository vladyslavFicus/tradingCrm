import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import TimelineLite from 'gsap/TimelineLite';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { NavLink } from 'components/Link';
import SidebarSubNav from '../SidebarSubNav';
import './SidebarNavItem.scss';

class SidebarNavItem extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    url: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem),
    isSidebarOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    icon: '',
    items: [],
    url: '',
  };

  state = {
    isOpen: false,
  };

  componentDidMount() {
    if (this.props.items.length) {
      this.initAnimation();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { isSidebarOpen, items, location: { pathname } } = this.props;

    if (prevProps.items.length !== items.length) {
      this.initAnimation();
    }

    if (this.submenu) {
      if ((isOpen && isSidebarOpen) && (!prevState.isOpen || prevProps.isSidebarOpen === false)) {
        this.navItemAnimation.play();
      } else if ((prevState.isOpen && !isOpen) || (prevProps.isSidebarOpen && isSidebarOpen === false)) {
        this.navItemAnimation.reverse();
      }
    }

    // Close sub menu if it was opened and sidebar stay closed
    if (!isSidebarOpen && isOpen) {
      this.close();
    }

    // Check if sidebar was closed and now stay opened and location includes current item url --> open sub menu
    if (!prevProps.isSidebarOpen && isSidebarOpen && items.some(({ url }) => pathname.includes(url))) {
      this.open();
    }
  }

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  initAnimation = () => {
    const navItemAnimation = new TimelineLite({ paused: true });
    const submenuDomNode = findDOMNode(this.submenu); // eslint-disable-line

    navItemAnimation
      .fromTo(submenuDomNode, 0.15, { height: 0 }, { height: submenuDomNode.scrollHeight })
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
    } = this.props;

    const withSubmenu = items.length > 0;

    if (!label || (!url && !withSubmenu)) {
      return null;
    }

    return (
      <li className="SidebarNavItem">
        <If condition={withSubmenu}>
          <button
            onClick={() => this.setState(({ isOpen }) => ({ isOpen: !isOpen }))}
            type="button"
            className={classNames('SidebarNavItem__link', { 'SidebarNavItem__link--active': this.state.isOpen })}
          >
            <If condition={icon}>
              <i className={classNames(icon, 'SidebarNavItem__icon')} />
            </If>
            <span className="SidebarNavItem__label">
              {I18n.t(label)}
            </span>
            <If condition={withSubmenu}>
              <i
                ref={(node) => {
                  this.icon = node;
                }}
                className="icon-nav-arrow-h SidebarNavItem__arrow"
              />
            </If>
          </button>
          <SidebarSubNav
            ref={(node) => {
              this.submenu = node;
            }}
            items={items}
          />
        </If>
        <If condition={!withSubmenu}>
          <NavLink
            className="SidebarNavItem__link"
            activeClassName="SidebarNavItem__link--active"
            to={url}
          >
            <If condition={icon}>
              <i className={classNames(icon, 'SidebarNavItem__icon')} />
            </If>
            <span className="SidebarNavItem__label">
              {I18n.t(label)}
            </span>
          </NavLink>
        </If>
      </li>
    );
  }
}

export default withRouter(SidebarNavItem);
