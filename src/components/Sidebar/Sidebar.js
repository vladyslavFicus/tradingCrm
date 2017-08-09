import React, { Component } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import Nav from '../Nav';
import PropTypes from '../../constants/propTypes';
import './Sidebar.scss';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onOpenTab: PropTypes.func.isRequired,
    menuClick: PropTypes.func.isRequired,
  };

  state = {
    isHover: false,
    isOpen: false,
  };

  openTimeout = null;

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
      }, 400);
    });
  };

  handleSidebarMouseLeave = () => {
    this.setState({
      isHover: false,
      isOpen: false,
    });

    if (!this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  };


  onMenuClick = (url) => {
    if (url) {
      this.setState({
        isHover: false,
        isOpen: false,
      });
      browserHistory.push(url);
      this.props.menuClick();
    }
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
    return (
      <aside
        className={classNames('sidebar', { sidebar_open: this.state.isOpen })}
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
            onOpenTab={this.props.onOpenTab}
            onMenuClick={this.onMenuClick}

          />
        </Scrollbars>
        <Nav
          items={this.props.bottomMenu}
          onMenuClick={this.onMenuClick}
          onOpenTab={this.props.onOpenTab}
        />
      </aside>
    );
  }
}

export default Sidebar;
