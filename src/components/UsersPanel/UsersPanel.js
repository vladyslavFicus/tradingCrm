import React, { Component } from 'react';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';

class UsersPanel extends Component {
  static propTypes = {
    //footerName: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
  };

  // static defaultProps = {
  //   footerName: 'footer',
  // };

  // state = {
  //   footerOpen: false,
  // };


  render() {
    return (
      <footer className="footer">
        <div className="footer-content row">
          <UsersPanelItem
            fullName="Jimmy Black"
            login="202222"
            uiid="PL-22222"
          />
        </div>
        <div className="footer-menu" onClick={this.handleFooterOpenClick}>
          &#10005;
        </div>
      </footer>
    );
  }
}

export default UsersPanel;
