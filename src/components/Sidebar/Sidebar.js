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
    onOpenTab: PropTypes.func.isRequired,
    menuClick: PropTypes.func.isRequired,
  };

  state = {
    isHover: false,
    isOpen: false,
  };

  openTimeout = null;
  closeTimeout = null;

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

    clearTimeout(this.closeTimeout);
    this.closeTimeout = null;
  };

  handleSidebarMouseLeave = () => {
    this.closeTimeout = setTimeout(() => {
      this.setState({
        isHover: false,
        isOpen: false,
      });
      this.props.menuClick();
    }, 400);

    if (!this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
  };


  onMenuClick = () => {
    this.setState({
      isHover: false,
      isOpen: false,
    });
    this.props.menuClick();
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
        className={classNames('sidebar', { sidebar_open: this.state.isOpen, 'add-delay': !this.state.isHover })}
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
            isSidebarOpen={this.state.isOpen}
          />
        </Scrollbars>
        <Nav
          items={this.props.bottomMenu}
          onMenuClick={this.onMenuClick}
          onOpenTab={this.props.onOpenTab}
          isSidebarOpen={this.state.isOpen}
        />
      </aside>
    );
  }
}

export default Sidebar;
