import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import FilterSetsOption from './components/FilterSetsOption';
import FilterSetsSearch from './components/FilterSetsSearch';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import './FilterSetsDropdown.scss';

class FilterSetsDropdown extends PureComponent {
  static propTypes = {
    filterSetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeFilterSet: PropTypes.object,
    selectFilterSet: PropTypes.func.isRequired,
    updateFavouriteFilterSet: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activeFilterSet: null,
  };

  state = {
    searchValue: '',
    sortedByFavorites: false,
  };

  searchFilterSet = ({ target: { value } }) => {
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
      filterSetsList,
      activeFilterSet,
      selectFilterSet,
      updateFavouriteFilterSet,
    } = this.props;

    const {
      searchValue,
      sortedByFavorites,
    } = this.state;

    const dropdownOptions = searchValue
      ? filterSetsList.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
      : filterSetsList;

    const sortedDropdownOptions = sortedByFavorites
      ? dropdownOptions.sort((a, b) => b.favourite - a.favourite)
      : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name));

    const activeFilterSetUuid = activeFilterSet?.uuid;

    return (
      <>
        <FilterSetsSearch
          value={searchValue}
          reset={this.resetSearch}
          onChange={this.searchFilterSet}
        />
        <Choose>
          <When condition={dropdownOptions.length}>
            <div className="FilterSetsDropdown__list">
              <If condition={activeFilterSet}>
                <div className="FilterSetsDropdown__list-row">
                  <div className="FilterSetsDropdown__list-title">
                    {I18n.t('FILTER_SET.DROPDOWN.LIST.SELECTED')}
                  </div>
                </div>
                <FilterSetsOption
                  filterSet={activeFilterSet}
                  updateFavouriteFilterSet={updateFavouriteFilterSet}
                />
              </If>

              <div className="FilterSetsDropdown__list-row">
                <div className="FilterSetsDropdown__list-title">
                  {I18n.t('FILTER_SET.DROPDOWN.LIST.TITLE')}
                </div>
                <div
                  className="FilterSetsDropdown__list-sort"
                  onClick={this.sortByFavorite}
                >
                  {
                    sortedByFavorites
                      ? I18n.t('COMMON.ALL')
                      : (
                        <>
                          <FavoriteStarIcon className="FilterSetsDropdown__list-sort-icon" />
                          {I18n.t('FILTER_SET.DROPDOWN.LIST.FAVORITE')}
                        </>
                      )
                  }
                </div>
              </div>
              {sortedDropdownOptions
                .filter(({ uuid }) => uuid !== activeFilterSetUuid)
                .map(filterSet => (
                  <FilterSetsOption
                    key={filterSet.uuid}
                    filterSet={filterSet}
                    selectFilterSet={selectFilterSet}
                    updateFavouriteFilterSet={updateFavouriteFilterSet}
                  />
                ))
              }
            </div>
          </When>
          <Otherwise>
            <div className="FilterSetsDropdown__not-found">
              {I18n.t('common.select.options_not_found', { query: searchValue })}
            </div>
          </Otherwise>
        </Choose>
      </>
    );
  }
}

export default FilterSetsDropdown;
