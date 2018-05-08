import React, { Component } from 'react';
import classNames from 'classnames';
import { IndexLink } from 'react-router';
import PropTypes from '../../constants/propTypes';
import DepartmentsDropDown from '../DepartmentsDropDown';
import HeaderNav from '../HeaderNav';
import { getLogo } from '../../config';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    onToggleProfile: PropTypes.func.isRequired,
  };
  static defaultProps = {
    showSearch: false,
  };
  static contextTypes = {
    user: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
      department: PropTypes.string,
      authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    }),
    changeDepartment: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };

  state = {
    searchFieldActive: false,
  };

  get indexLink() {
    return Object.keys(this.context.user.departmentsByBrand).length > 1 ? '/brands' : '/';
  }

  handleSearchFieldClick = () => {
    this.setState({ searchFieldActive: true }, () => {
      this.searchInput.focus();
    });
  };

  handleOverlayClick = () => {
    this.setState({ searchFieldActive: false });
  };

  handleChangeDepartment = (department) => {
    this.context.changeDepartment(department, this.context.user.brandId);
  };

  render() {
    const { user } = this.context;
    const { searchFieldActive } = this.state;
    const { showSearch } = this.props;

    return (
      <header className="header">
        <IndexLink className="header__brand" to={this.indexLink}>
          <img className="img-fluid" src={getLogo()} alt="current-casino-logo" />
        </IndexLink>
        <DepartmentsDropDown
          onChange={this.handleChangeDepartment}
          current={user.authorities.find(authority => authority.department === user.department)}
          authorities={user.authorities.filter(authority => authority.department !== user.department)}
        />
        <If condition={showSearch}>
          <form className="search">
            <i className="fa fa-search" />
            <input
              className="form-control search__input"
              type="text"
              placeholder="Type to search"
              onClick={this.handleSearchFieldClick}
            />
            <div className={classNames('search-overlay', { open: searchFieldActive })}>
              <div className="search-overlay__content">
                <input
                  className="form-control search-overlay__input"
                  type="text"
                  placeholder="Search..."
                  ref={(node) => {
                    this.searchInput = node;
                  }}
                />
                <button
                  type="button"
                  className="search-overlay__close"
                  onClick={this.handleOverlayClick}
                >
                  &times;
                </button>
              </div>
            </div>
          </form>
        </If>
        <HeaderNav
          items={[
            { label: 'My profile', onClick: () => this.props.onToggleProfile() },
            {
              label: 'Logout',
              onClick: () => this.props.router.replace('/logout'),
              id: 'profile-logout-button',
            },
          ]}
        />
      </header>
    );
  }
}

export default Header;
