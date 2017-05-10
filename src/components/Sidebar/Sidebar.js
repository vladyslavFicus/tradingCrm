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

  state = {
    scrollbarHover: false,
  };

  handleMouseEnter = () => {
    this.setState({ scrollbarHover: true });
  };

  handleMouseLeave = () => {
    this.setState({ scrollbarHover: false });
  };

  renderThumbVertical = ({ style, ...props }) => {
    const { hover } = this.state;
    return <div style={{ ...style, opacity: hover ? 1 : 0 }} {...props} />;
  };

  render () {
    return (
      <aside className="sidebar">
        <Scrollbars
          renderThumbVertical={this.renderTrackVertical}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          renderTrackHorizontal={props => <div {...props} className="track-vertical" style={{ display: 'none' }} />}
          renderThumbHorizontal={props => <div {...props} className="thumb-vertical" style={{ display: 'none' }} />}
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
