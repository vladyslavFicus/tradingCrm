import React, { PureComponent } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { TimelineLite as TimeLineLite } from 'gsap';
import PropTypes from 'constants/propTypes';
import { sidebarTopMenu, sidebarBottomMenu } from 'config/menu';
import { withPermission } from 'providers/PermissionsProvider';
import SidebarNav from './components/SidebarNav';
import './Sidebar.scss';

class Sidebar extends PureComponent {
  static propTypes = {
    position: PropTypes.string.isRequired,
    permission: PropTypes.permission.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
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

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;

    if (this.props.location.pathname !== prevProps.location.pathname) {
      setTimeout(this.close, 200);
    }

    if (!this.navLinkAnimated) {
      this.navLinkAnimated = true;
      this.sidebarAnimation.fromTo('.SidebarNavItem__label', 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });
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
    const { position } = this.props;
    const { isOpen } = this.state;

    return (
      <aside
        ref={(node) => { this.sidebar = node; }}
        className={`Sidebar Sidebar--${position}`}
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        <Scrollbars
          className="Scrollbars"
          renderView={props => <div {...props} className="ScrollbarContainer" />}
          renderTrackHorizontal={props => <div {...props} className="TrackHorizontal" />}
          renderThumbHorizontal={props => <div {...props} className="ThumbHorizontal" />}
          renderThumbVertical={props => <div {...props} className="ThumbVertical" />}
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

export default compose(
  withRouter,
  withPermission,
)(Sidebar);
