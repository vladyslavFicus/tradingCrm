import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';
import { TimelineLite as TimeLineLite } from 'gsap';
import PropTypes from 'constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from 'config/menu';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import SidebarNav from '../SidebarNav';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    auth: PropTypes.auth.isRequired,
    permission: PropTypes.permission.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextTypes = {
    user: PropTypes.object,
  };

  navLinkAnimated = false;

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const sidebarAnimation = new TimeLineLite({ paused: true });

    sidebarAnimation.fromTo(this.sidebar, 0.15, { width: '60px' }, { width: '240px' });
    this.sidebarAnimation = sidebarAnimation;
  }

  componentDidUpdate(_prevProps, prevState) {
    const { isOpen } = this.state;

    if (this.props.location.pathname !== _prevProps.location.pathname) {
      setTimeout(this.close, 200);
    }

    if (!this.navLinkAnimated) {
      this.navLinkAnimated = true;
      this.sidebarAnimation.fromTo('.sidebar-nav-item__label', 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });
    }

    if (!prevState.isOpen && isOpen) {
      this.sidebarAnimation.play();
    }

    if (prevState.isOpen && !isOpen) {
      this.sidebarAnimation.reverse();
    }
  }

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <aside
        ref={(node) => { this.sidebar = node; }}
        className="sidebar"
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        <Scrollbars
          renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
          renderThumbHorizontal={props => <div {...props} style={{ display: 'none' }} />}
          renderThumbVertical={props => <div {...props} style={{ backgroundColor: 'rgba(223, 228, 237, 0.25)' }} />}
          style={{ height: 'calc(100% - 48px)' }}
        >
          <SidebarNav
            isSidebarOpen={isOpen}
            items={sidebarTopMenu}
          />
        </Scrollbars>
        <SidebarNav
          isSidebarOpen={isOpen}
          items={sidebarBottomMenu}
        />
      </aside>
    );
  }
}

export default withRouter(withPermission(withStorage(['auth'])(Sidebar)));
