import React, { Component } from 'react';
import classNames from 'classnames';
import { IndexLink } from 'react-router';
import { sidebarTopMenu, sidebarBottomMenu } from '../../config/menu';
import Sidebar from '../../components/Sidebar';
import UsersPanel from '../../components/UsersPanel';

import './NewLayout.scss';

class NewLayout extends Component {
  state = {
    searchFieldActive: false,
    searchOverlayActive: false,
    dropDownOpen: false,
    arrowToggle: false,
    footerOpen: false,
    // tabRemove: false,
  }

  handleSearchFieldClick = () => {
    this.setState({searchFieldActive: true}, () => {
      this.searchInput.focus();
    })
  }

  handleOverlayClick = () => {
    this.setState({searchFieldActive: false});
  }

  handleDropDownClick = () => {
    this.setState({dropDownOpen: !this.state.dropDownOpen, arrowToggle: !this.state.arrowToggle});
  }

  handleFooterOpenClick = () => {
    this.setState({footerOpen: true});
  }

  render () {
    const {children} = this.props;

    return (<div>
      {this.renderHeader()}
      <Sidebar
        topMenu={sidebarTopMenu}
        bottomMenu={sidebarBottomMenu}
      />
      {this.renderSection(children) }
      <UsersPanel />
      {/*{this.renderTabs()}*/}
    </div>);
  }

  renderHeader () {
    const {searchFieldActive} = this.state;
    const {searchOverlayActive} = this.state;
    const {dropDownOpen} = this.state;
    const {arrowToggle} = this.state;

    return (
      <header className="layout-header">
        <nav className="navbar navbar-fixed-top">
          <IndexLink className="navbar-brand" href={'/'}>
            <img className="img-fluid" src="/img/temp/logo.png" alt="current-lottery-logo"/>
          </IndexLink>

            <ul className="navbar-nav left-navigation">
              <li className="nav-item dropdown department">
                <a className="nav-link dropdown-toggle" href="#" onClick={this.handleDropDownClick}>
                  Customer Service<i className={classNames('fa fa-angle-down', {arrowup: arrowToggle})} />
                  <div className="role">Head of department</div>
                </a>
                <div className={classNames('dropdown-menu', {activated: dropDownOpen})}>
                  <div className="dropdown-item">
                    <a href="#">Risk Fraud & Payment</a>
                    <span className="role">Manager</span>
                  </div>
                  <div className="dropdown-item">
                    <a href="#">Marketing</a>
                    <span className="role">Senior Manager</span>
                  </div>
                </div>
              </li>
              <form className="form-inline">
                <i className="fa fa-search" />
                <input
                  className="form-control" type="text" placeholder="Type to search"
                  onClick={this.handleSearchFieldClick}
                />
                <div className={classNames('search-overlay', {open: searchFieldActive})}>
                  <div className="search-overlay__content">
                    <button
                      type="button" className={classNames('overlay-close', {closed: searchOverlayActive})}
                      onClick={this.handleOverlayClick}
                    >&#10005;</button>
                    <div className="form-inline">
                      <input
                        className="form-control" type="text" placeholder="Search..." autoFocus ref={(node) => {
                          this.searchInput = node
                        }}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </ul>
            <ul className="navbar-nav right-navigation">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#">
                  <i className="fa fa-bell" />
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-item">Notifications</div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#">
                  <i className="fa fa-star" />
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-item">Favorites</div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#">
                  <i className="fa fa-user" />
                </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">Log-out</a>
                </div>
              </li>
            </ul>
        </nav>
      </header>
    );
  }

  renderSection = (children) => {
    return (
      <section>
        <div className="section-container">
          {children}
        </div>
      </section>
    );
  }
}

export default NewLayout;
