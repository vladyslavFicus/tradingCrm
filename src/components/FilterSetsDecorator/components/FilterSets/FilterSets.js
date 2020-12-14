import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import FilterSetsOption from './FilterSetsOption';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './FilterSets.scss';

class FilterSets extends PureComponent {
  static propTypes = {
    selectFilter: PropTypes.func.isRequired,
    updateFavouriteFilter: PropTypes.func.isRequired,
    filtersList: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedFilter: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    selectedFilter: '',
    disabled: false,
  };

  state = {
    sortedByFavorites: false,
    isOpenDropdown: false,
    searchInputValue: '',
  };

  handleToggleDropdown = () => {
    this.setState(({ isOpenDropdown }) => ({
      isOpenDropdown: !isOpenDropdown,
    }));
  };

  handleSearchFilters = ({ target: { value } }) => {
    this.setState({ searchInputValue: value });
  };

  handleToogleSortFiltesListByFavorite = () => {
    this.setState(({ sortedByFavorites }) => ({
      sortedByFavorites: !sortedByFavorites,
    }));
  };

  render() {
    const {
      selectFilter,
      updateFavouriteFilter,
      filtersList,
      selectedFilter,
      disabled,
    } = this.props;

    const {
      isOpenDropdown,
      searchInputValue,
      sortedByFavorites,
    } = this.state;

    const dropdownOptions = searchInputValue
      ? filtersList.filter(({ name }) => name.toLowerCase().includes(searchInputValue.toLowerCase()))
      : filtersList;

    const sortedDropdownOptions = sortedByFavorites
      ? dropdownOptions.sort((a, b) => b.favourite - a.favourite)
      : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name));

    const activeFilter = filtersList.find(({ uuid }) => uuid === selectedFilter);
    const activeFilterName = activeFilter ? activeFilter.name : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <div className="filter-favorites__dropdown-container">
        <Dropdown
          className={
            classNames('filter-favorites__dropdown', { 'is-disabled': disabled })
          }
          toggle={this.handleToggleDropdown}
          isOpen={isOpenDropdown}
        >
          <div className="filter-favorites__dropdown-label">
            {I18n.t('FILTER_SET.DROPDOWN.LABEL')}
          </div>

          <DropdownToggle className="filter-favorites__dropdown-head form-control" tag="div">
            <div
              className={classNames('filter-favorites__dropdown-head-value', { 'is-placeholder': !activeFilter })}
            >
              {activeFilterName}
            </div>
            <i className="filter-favorites__dropdown-head-icon icon icon-arrow-down select-icon" />
          </DropdownToggle>

          <DropdownMenu className="filter-favorites__dropdown-drop" right>
            <div className="filter-favorites__dropdown-search select-search-box">
              <i className="icon icon-search select-search-box__icon-left" />
              <input
                type="text"
                className="form-control"
                placeholder={I18n.t('common.select.default_placeholder')}
                onChange={this.handleSearchFilters}
                value={searchInputValue}
              />
              <If condition={searchInputValue}>
                <i
                  className="icon icon-times select-search-box__icon-right"
                  onClick={() => this.handleSearchFilters({ target: { value: '' } })}
                />
              </If>
            </div>
            <Choose>
              <When condition={dropdownOptions.length}>
                <div className="filter-favorites__dropdown-list">
                  <If condition={activeFilter}>
                    <div className="filter-favorites__dropdown-list-top">
                      <div className="filter-favorites__dropdown-list-title">
                        Selected options
                      </div>
                    </div>
                    <FilterSetsOption
                      filter={activeFilter}
                      updateFavouriteFilter={updateFavouriteFilter}
                    />
                  </If>

                  <div className="filter-favorites__dropdown-list-top">
                    <div className="filter-favorites__dropdown-list-title">
                      {I18n.t('FILTER_SET.DROPDOWN.LIST.TITLE')}
                    </div>
                    <div
                      className="filter-favorites__dropdown-list-sort"
                      onClick={this.handleToogleSortFiltesListByFavorite}
                    >
                      {
                        sortedByFavorites
                          ? I18n.t('COMMON.ALL')
                          : (
                            <>
                              <FavoriteStarIcon />
                              {I18n.t('FILTER_SET.DROPDOWN.LIST.FAVORITE')}
                            </>
                          )
                      }
                    </div>
                  </div>
                  {sortedDropdownOptions
                    .filter(({ uuid }) => uuid !== selectedFilter)
                    .map(filter => (
                      <FilterSetsOption
                        key={filter.uuid}
                        filter={filter}
                        selectFilter={selectFilter}
                        updateFavouriteFilter={updateFavouriteFilter}
                      />
                    ))
                  }
                </div>
              </When>
              <Otherwise>
                <div className="filter-favorites__dropdown-list">
                  <div className="filter-favorites__dropdown-not-found font-size-10 text-muted margin-10">
                    {I18n.t('common.select.options_not_found', { query: searchInputValue })}
                  </div>
                </div>
              </Otherwise>
            </Choose>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default FilterSets;
