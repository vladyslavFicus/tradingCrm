import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { TimelineLite as TimeLineLite } from 'gsap';
import PropTypes from 'constants/propTypes';
import SidebarNav from '../SidebarNav';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onToggleTab: PropTypes.func.isRequired,
    menuItemClick: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.object,
  };

  navLinkAnimated = false;

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { permissions, user: { department, role } } = this.context;
    const sidebarAnimation = new TimeLineLite({ paused: true });

    sidebarAnimation.fromTo(this.sidebar, 0.15, { width: '60px' }, { width: '240px' });
    this.sidebarAnimation = sidebarAnimation;

    this.props.init(permissions, { department, role });
  }

  componentDidUpdate(_prevProps, prevState) {
    const { isOpen } = this.state;

    if (this.props.topMenu.length && !this.navLinkAnimated) {
      this.navLinkAnimated = true;
      this.sidebarAnimation.fromTo('.sidebar-nav-item__label', 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });
    }

    if (!prevState.isOpen && isOpen) {
      this.sidebarAnimation.play();
    } else if (prevState.isOpen && !isOpen) {
      this.sidebarAnimation.reverse();
    }
  }

  onMenuItemClick = () => {
    this.setState({
      isOpen: false,
    }, this.props.menuItemClick);
  };

  open = () => {
    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
    }
  };

  close = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  toggleTab = (index) => {
    this.open();

    this.props.onToggleTab(index);
  };

  render() {
    const { topMenu, bottomMenu, onToggleTab } = this.props;
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
            items={topMenu}
            onToggleTab={this.toggleTab}
            onMenuItemClick={this.onMenuItemClick}
          />
        </Scrollbars>
        <SidebarNav
          isSidebarOpen={isOpen}
          items={bottomMenu}
          onToggleTab={onToggleTab}
          onMenuItemClick={this.onMenuItemClick}
        />
      </aside>
    );
  }
}

export default Sidebar;
