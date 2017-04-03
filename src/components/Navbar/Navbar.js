import React, { Component } from 'react';
import classNames from 'classnames';
import { IndexLink } from 'react-router';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DepartmentsDropDown from '../DepartmentsDropDown';
import './Navbar.scss';

class Navbar extends Component {
  static propTypes = {};

  state = {
    searchFieldActive: false,
    searchOverlayActive: false,
  };

  handleSearchFieldClick = () => {
    this.setState({ searchFieldActive: true }, () => {
      this.searchInput.focus();
    });
  };

  handleOverlayClick = () => {
    this.setState({ searchFieldActive: false });
  };

  render() {
    const { searchFieldActive, searchOverlayActive } = this.state;

    return (
      <header className="layout-header navbar-fixed-top">
        <IndexLink className="navbar-brand" href={'/'}>
          <img className="img-fluid" src="/img/temp/logo.png" alt="current-lottery-logo" />
        </IndexLink>

        <div className="left-navigation">
          <div className="department">
            <DepartmentsDropDown
              current={{ name: 'Customer Service', role: 'Head of department' }}
              departments={[
                { name: 'Risk Fraud & Payment', role: 'Manager' },
                { name: 'Marketing', role: 'Team lead' },
              ]}
            />
          </div>

          <form className="form-inline">
            <i className="fa fa-search" />
            <input
              className="form-control" type="text" placeholder="Type to search"
              onClick={this.handleSearchFieldClick}
            />

            <div className={classNames('search-overlay', { open: searchFieldActive })}>
              <div className="search-overlay__content">
                <button
                  type="button" className={classNames('overlay-close', { closed: searchOverlayActive })}
                  onClick={this.handleOverlayClick}
                >&#10005;</button>
                <div className="form-inline">
                  <input
                    className="form-control" type="text" placeholder="Search..." autoFocus ref={(node) => {
                    this.searchInput = node;
                  }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="right-navigation">
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#">
              <i className="fa fa-user" />
            </a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">Log-out</a>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Navbar;
