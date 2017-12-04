import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { TimelineLite, Power3 } from 'gsap';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onToggleTab: PropTypes.func.isRequired,
    menuItemClick: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { sidebar } = this;
    this.props.menuItemClick();

    const tl = new TimelineLite({ paused: true });

    tl.fromTo(sidebar, 0.2, { width: '60px' }, { width: '240px', ease: Power3.easeOut })
      .fromTo('.nav-link__label', 0.2, { autoAlpha: 0 }, { autoAlpha: 1 });

    this.tl = tl;
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;

    if (!prevState.isOpen && isOpen) {
      this.tl.play();
    } else if (prevState.isOpen && !isOpen) {
      this.tl.reverse();
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
            items={topMenu}
            onToggleTab={this.toggleTab}
            onMenuItemClick={this.onMenuItemClick}
          />
        </Scrollbars>
        <Nav
          items={bottomMenu}
          onToggleTab={onToggleTab}
          onMenuItemClick={this.onMenuItemClick}
        />
      </aside>
    );
  }
}

export default Sidebar;
