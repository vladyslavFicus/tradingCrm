import React, { Component } from 'react';
import classNames from 'classnames';
import { IndexLink } from 'react-router';
import PropTypes from '../../constants/propTypes';
import DepartmentsDropDown from '../DepartmentsDropDown';
import NavbarNav from '../NavbarNav';
import LocaleSwitcher from '../LocaleSwitcher';
import { getLogo } from '../../config';
import './Navbar.scss';

class Navbar extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    onLocaleChange: PropTypes.func.isRequired,
    languages: PropTypes.arrayOf(PropTypes.dropDownOption).isRequired,
  };
  static defaultProps = {
    showSearch: true,
  };
  static contextTypes = {
    user: PropTypes.shape({
      department: PropTypes.string,
      authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    }),
    changeDepartment: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
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
    const { user, changeDepartment, locale } = this.context;
    const { searchFieldActive, searchOverlayActive } = this.state;
    const { showSearch, onLocaleChange, languages } = this.props;

    return (
      <header className="layout-header">
        <IndexLink className="navbar-brand" href={'/'}>
          <img src={getLogo()} alt="current-lottery-logo" />
        </IndexLink>

        <div className="left-navigation">
          <div className="department">
            <DepartmentsDropDown
              onChange={changeDepartment}
              current={user.authorities.find(authority => authority.department === user.department)}
              authorities={user.authorities.filter(authority => authority.department !== user.department)}
            />
          </div>

          {
            showSearch &&
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
          }
        </div>

        <div className="margin-right-20">
          <LocaleSwitcher
            languages={languages}
            currentLocale={locale}
            changeLocale={onLocaleChange}
          />
        </div>

        <div className="right-navigation">
          <NavbarNav
            label={<i className="fa fa-user" />}
            items={[
              { label: 'Logout', onClick: () => this.props.router.replace('/logout') },
            ]}
          />
        </div>
      </header>
    );
  }
}

export default Navbar;
