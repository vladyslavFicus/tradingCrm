import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { TimelineLite as TimeLineLite } from 'gsap';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onToggleTab: PropTypes.func.isRequired,
    menuItemClick: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { init, menuItemClick } = this.props;

    init();
    menuItemClick();

    const sidebarAnimation = new TimeLineLite({ paused: true });
    sidebarAnimation.fromTo(this.sidebar, 0.15, { width: '60px' }, { width: '240px' });

    this.sidebarAnimation = sidebarAnimation;
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { topMenu } = this.props;

    if (topMenu.length && !this.navLinkAnimated) {
      this.navLinkAnimated = true;
      this.sidebarAnimation.fromTo('.nav-link__label', 0.15, { autoAlpha: 0 }, { autoAlpha: 1 });
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

  navLinkAnimated = false;

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

  renderTrackHorizontal = props => (
    <div {...props} className="track-vertical" style={{ display: 'none' }} />
  );

  renderThumbHorizontal = props => (
    <div {...props} className="thumb-vertical" style={{ display: 'none' }} />
  );

  renderThumbVertical = (style, ...props) => (
    <div className="scroll-bar" {...props} style={{ ...style, backgroundColor: 'rgba(223,228,237,0.25)' }} />
  );

  render() {
    const { topMenu, bottomMenu, onToggleTab } = this.props;
    const { isOpen } = this.state;

    return (
      <aside
        ref={node => this.sidebar = node}
        className="sidebar"
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        <Scrollbars
          renderTrackHorizontal={this.renderTrackHorizontal}
          renderThumbHorizontal={this.renderThumbHorizontal}
          renderThumbVertical={this.renderThumbVertical}
          style={{ height: 'calc(100% - 85px)' }}
        >
          <Nav
            isSidebarOpen={isOpen}
            items={topMenu}
            onToggleTab={this.toggleTab}
            onMenuItemClick={this.onMenuItemClick}
          />
        </Scrollbars>
        <Nav
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
