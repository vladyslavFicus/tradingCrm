import React, { Component } from 'react';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import Scrollbars from 'react-custom-scrollbars';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  };

  render () {
    return (
      <aside className="sidebar">
        <Scrollbars
          renderTrackHorizontal={props => <div {...props} className="track-vertical" style={{ display: 'none' }} />}
          renderThumbHorizontal={props => <div {...props} className="thumb-vertical" style={{ display: 'none' }} />}
          renderThumbVertical={({ style, ...props }) =>
            <div className="scroll-bar" {...props} style={{ ...style, backgroundColor: 'rgba(223,228,237,0.25)' }} />}
          style={{
            height: 'calc(100% - 100px)',
          }}
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
