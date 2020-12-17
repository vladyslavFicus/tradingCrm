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
    filterSetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedFilterSet: PropTypes.string,
    disabled: PropTypes.bool,
    selectFilterSet: PropTypes.func.isRequired,
    updateFavouriteFilterSet: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedFilterSet: '',
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

  selectFilterSet = (uuid) => {
    this.toggleDropdown();
    this.props.selectFilterSet(uuid);
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
      updateFavouriteFilterSet,
      filterSetsList,
      selectedFilterSet,
      disabled,
    } = this.props;

    const {
      isOpen,
      searchValue,
      sortedByFavorites,
    } = this.state;

    const dropdownOptions = searchValue
      ? filterSetsList.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
      : filterSetsList;

    const sortedDropdownOptions = sortedByFavorites
      ? dropdownOptions.sort((a, b) => b.favourite - a.favourite)
      : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name));

    const activeFilterSet = filterSetsList.find(({ uuid }) => uuid === selectedFilterSet);
    const activeFilterSetName = activeFilterSet?.name || I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <div
        className={
          classNames('FilterSets', {
            'FilterSets--disabled': disabled,
            'FilterSets--unfolded': isOpen,
            'FilterSets--inactive': !activeFilterSet,
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
              {activeFilterSetName}
            </div>
            <i className="FilterSets__head-icon icon icon-arrow-down" />
          </DropdownToggle>

          <DropdownMenu className="FilterSets__dropdown" right>
            <FilterSetsSearch
              value={searchValue}
              onChange={this.searchFilterSet}
              reset={this.resetSearch}
            />
            <Choose>
              <When condition={dropdownOptions.length}>
                <div className="FilterSets__dropdown-list">
                  <If condition={activeFilterSet}>
                    <div className="FilterSets__dropdown-list-row">
                      <div className="FilterSets__dropdown-list-title">
                        {I18n.t('FILTER_SET.DROPDOWN.LIST.SELECTED')}
                      </div>
                    </div>
                    <FilterSetsOption
                      filterSet={activeFilterSet}
                      updateFavouriteFilterSet={updateFavouriteFilterSet}
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
                    .filter(({ uuid }) => uuid !== selectedFilterSet)
                    .map(filterSet => (
                      <FilterSetsOption
                        key={filterSet.uuid}
                        filterSet={filterSet}
                        selectFilterSet={this.selectFilterSet}
                        updateFavouriteFilterSet={updateFavouriteFilterSet}
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
