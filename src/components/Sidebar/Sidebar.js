import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import classNames from 'classnames';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  }

  state = {
    isHover: false,
    isOpen: false,
  }

  openTimeout = null

  renderTrackHorizontal = props => (
    <div {...props} className="track-vertical" style={{ display: 'none' }}/>
  )

  renderThumbHorizontal = props => (
    <div {...props} className="thumb-vertical" style={{ display: 'none' }}/>
  )

  renderThumbVertical = (style, ...props) => (
    <div className="scroll-bar" {...props} style={{ ...style, backgroundColor: 'rgba(223,228,237,0.25)' }}/>
  )

  handleSidebarMouseEnter = () => {
    this.setState({
      isHover: true,
    }, () => {
      this.openTimeout = setTimeout(() => {
        if (this.state.isHover) {
          this.setState({
            isOpen: true,
          });
        }
      }, 1000);
    });
  }

  handleSidebarMouseLeave = () => {
    this.setState({
      isHover: false,
      isOpen: false,
    });

    if (!this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  }

  render() {
    return (
      <aside
        className={classNames('sidebar', { open: this.state.isOpen })}
        onMouseEnter={this.handleSidebarMouseEnter}
        onMouseLeave={this.handleSidebarMouseLeave}
      >
        <Scrollbars
          renderTrackHorizontal={this.renderTrackHorizontal}
          renderThumbHorizontal={this.renderThumbHorizontal}
          renderThumbVertical={this.renderThumbVertical}
          style={{ height: 'calc(100% - 85px)' }}
        >
          <Nav
            items={this.props.topMenu}
            handleOpenTap={this.props.handleOpenTap}
          />
        </Scrollbars>
        <Nav
          items={this.props.bottomMenu}
        />
      </aside>
    );
  }
}

export default Sidebar;
