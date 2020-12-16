import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import FilterSetsOption from './components/FilterSetsOption';
import FilterSetsSearch from './components/FilterSetsSearch';
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
    isOpen: false,
    searchValue: '',
    sortedByFavorites: false,
  };

  toggleDropdown = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  searchFilters = ({ target: { value } }) => {
    this.setState({ searchValue: value });
  };

  resetSearch = () => {
    this.setState({ searchValue: '' });
  };

  sortByFavorite = () => {
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
      isOpen,
      searchValue,
      sortedByFavorites,
    } = this.state;

    const dropdownOptions = searchValue
      ? filtersList.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
      : filtersList;

    const sortedDropdownOptions = sortedByFavorites
      ? dropdownOptions.sort((a, b) => b.favourite - a.favourite)
      : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name));

    const activeFilter = filtersList.find(({ uuid }) => uuid === selectedFilter);
    const activeFilterName = activeFilter?.name || I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <div
        className={
          classNames('FilterSets', {
            'FilterSets--disabled': disabled,
            'FilterSets--unfolded': isOpen,
            'FilterSets--inactive': !activeFilter,
          })
        }
      >
        <Dropdown
          className="FilterSets__dropdown"
          toggle={this.toggleDropdown}
          isOpen={isOpen}
        >
          <div className="FilterSets__label">
            {I18n.t('FILTER_SET.DROPDOWN.LABEL')}
          </div>

          <DropdownToggle className="FilterSets__head" tag="div">
            <div className="FilterSets__head-value">
              {activeFilterName}
            </div>
            <i className="FilterSets__head-icon icon icon-arrow-down" />
          </DropdownToggle>

          <DropdownMenu className="FilterSets__dropdown" right>
            <FilterSetsSearch
              value={searchValue}
              onChange={this.searchFilters}
              reset={this.resetSearch}
            />
            <Choose>
              <When condition={dropdownOptions.length}>
                <div className="FilterSets__dropdown-list">
                  <If condition={activeFilter}>
                    <div className="FilterSets__dropdown-list-row">
                      <div className="FilterSets__dropdown-list-title">
                        {I18n.t('FILTER_SET.DROPDOWN.LIST.SELECTED')}
                      </div>
                    </div>
                    <FilterSetsOption
                      filter={activeFilter}
                      updateFavouriteFilter={updateFavouriteFilter}
                    />
                  </If>

                  <div className="FilterSets__dropdown-list-row">
                    <div className="FilterSets__dropdown-list-title">
                      {I18n.t('FILTER_SET.DROPDOWN.LIST.TITLE')}
                    </div>
                    <div
                      className="FilterSets__dropdown-list-sort"
                      onClick={this.sortByFavorite}
                    >
                      {
                        sortedByFavorites
                          ? I18n.t('COMMON.ALL')
                          : (
                            <>
                              <FavoriteStarIcon className="FilterSets__dropdown-list-sort-icon" />
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
                <div className="FilterSets__dropdown-not-found">
                  {I18n.t('common.select.options_not_found', { query: searchValue })}
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
