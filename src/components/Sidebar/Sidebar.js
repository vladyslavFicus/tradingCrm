import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  };

  renderTrackHorizontal = (props) => {
    return (
      <div {...props} className="track-vertical" style={{ display: 'none' }} />
    );
  };

  renderThumbHorizontal = (props) => {
    return (
      <div {...props} className="thumb-vertical" style={{ display: 'none' }} />
    );
  };

  renderThumbVertical = (style, ...props) => {
    return (
      <div className="scroll-bar" {...props} style={{ ...style, backgroundColor: 'rgba(223,228,237,0.25)' }} />
    );
  };

  render() {
    return (
      <aside className="sidebar">
        <Scrollbars
          renderTrackHorizontal={this.renderTrackHorizontal}
          renderThumbHorizontal={this.renderThumbHorizontal}
          renderThumbVertical={this.renderThumbVertical}
          style={{ height: 'calc(100% - 100px)' }}
        >
          <Nav
            items={this.props.topMenu}
          />
        </Scrollbars>
        <Nav
          className="navbar-nav support-tab"
          items={this.props.bottomMenu}
        />
      </aside>
    );
  }
}

export default Sidebar;
