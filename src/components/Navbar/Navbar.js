import React, { Component } from 'react';
import classNames from 'classnames';
import { IndexLink } from 'react-router';
import PropTypes from '../../constants/propTypes';
import DepartmentsDropDown from '../DepartmentsDropDown';
import NavbarNav from '../NavbarNav';
import './Navbar.scss';

class Navbar extends Component {
  static propTypes = {};
  static contextTypes = {
    user: PropTypes.shape({
      department: PropTypes.string.isRequired,
      authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    }),
    changeDepartment: PropTypes.func.isRequired,
  };

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
    const { user, changeDepartment } = this.context;
    const { searchFieldActive, searchOverlayActive } = this.state;

    return (
      <header className="layout-header navbar-fixed-top">
        <IndexLink className="navbar-brand" href={'/'}>
          <img className="img-fluid" src="/img/temp/logo.png" alt="current-lottery-logo" />
        </IndexLink>

        <div className="left-navigation">
          <div className="department">
            <DepartmentsDropDown
              onChange={changeDepartment}
              current={user.authorities.find(authority => authority.department === user.department)}
              authorities={user.authorities.filter(authority => authority.department !== user.department)}
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
          <NavbarNav />
        </div>
      </header>
    );
  }
}

export default Navbar;
