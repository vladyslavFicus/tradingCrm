import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'constants/propTypes';
import DepartmentsDropDown from '../DepartmentsDropDown';
import HeaderNav from '../HeaderNav';
import HeaderCallbacksCalendarDropdown from '../HeaderCallbacksCalendarDropdown';
import Logo from '../Logo';
import history from '../../router/history';
import './Header.scss';

class Header extends Component {
  static propTypes = {
    showSearch: PropTypes.bool,
    onToggleProfile: PropTypes.func.isRequired,
    user: PropTypes.shape({
      logged: PropTypes.bool.isRequired,
      brandId: PropTypes.string,
      departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
      department: PropTypes.string,
      authorities: PropTypes.arrayOf(PropTypes.authorityEntity),
    }).isRequired,
    onDepartmentChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    showSearch: false,
  };

  state = {
    searchFieldActive: false,
  };

  get indexLink() {
    return this.props.user && Object.keys(this.props.user.departmentsByBrand).length > 1 ? '/brands' : '/';
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
    this.props.onDepartmentChange(department, this.props.user.brandId);
  };

  render() {
    const { searchFieldActive } = this.state;
    const { showSearch, user } = this.props;

    return (
      <header className="header">
        <Logo className="header__brand" to={this.indexLink} />

        <If condition={user.logged && user.authorities.length > 0}>
          <DepartmentsDropDown
            onChange={this.handleChangeDepartment}
            current={user.authorities.find(authority => authority.department === user.department)}
            authorities={user.authorities.filter(authority => authority.department !== user.department)}
          />
        </If>
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
        <div className="header__navigation">
          <HeaderCallbacksCalendarDropdown />
          <HeaderNav
            items={[
              { label: I18n.t('HEADER_PROFILE.MY_PROFILE'), onClick: () => this.props.onToggleProfile() },
              {
                label: I18n.t('HEADER_PROFILE.LOGOUT'),
                onClick: () => history.replace('/logout'),
                id: 'profile-logout-button',
              },
            ]}
          />
        </div>
      </header>
    );
  }
}

export default Header;
