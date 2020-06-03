import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import { filterSetByIdQuery } from 'graphql/queries/filterSet';
import FilterSelectOption from './FilterSelectOption';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';
import './FilterSet.scss';

class FilterSet extends PureComponent {
  static propTypes = {
    favourite: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleSelectFilterDropdownItem: PropTypes.func.isRequired,
    handleToggleFiltersVisibility: PropTypes.func.isRequired,
    common: PropTypes.arrayOf(PropTypes.object).isRequired,
    isDataLoading: PropTypes.bool.isRequired,
    handleHistoryReplace: PropTypes.func.isRequired,
    filtersLoading: PropTypes.bool.isRequired,
    filtersRefetch: PropTypes.func.isRequired,
    submitFilters: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    errorLoading: PropTypes.object,
    selectValue: PropTypes.string,
    notify: PropTypes.func.isRequired,
    updateFavourite: PropTypes.func.isRequired,
  };

  static defaultProps = {
    errorLoading: null,
    selectValue: '',
  };

  state = {
    sortedByFavorites: false,
    filterSetLoading: false,
    isOpenDropdown: false,
    filtersVisible: true,
    searchInputValue: '',
  };

  handleSetFilterValues = async (uuid) => {
    const {
      handleSelectFilterDropdownItem,
      handleHistoryReplace,
      submitFilters,
      notify,
      client,
    } = this.props;

    this.setState({
      filterSetLoading: true,
      isOpenDropdown: false,
    });

    const { data: { filterSet: { data, error } } } = await client.query({
      query: filterSetByIdQuery,
      variables: { uuid },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });

      return;
    }

    handleHistoryReplace(data);
    submitFilters(data);

    this.setState({ filterSetLoading: false });

    handleSelectFilterDropdownItem(uuid);
  };

  handleUpdateFavorite = async (uuid, newValue) => {
    const { updateFavourite, notify, filtersRefetch } = this.props;

    this.setState({ filterSetLoading: true });

    const { data: { filterSet: { updateFavourite: { error } } } } = await updateFavourite({
      variables: {
        uuid,
        favourite: newValue,
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });

      return;
    }

    await filtersRefetch();

    notify({
      level: 'success',
      title: I18n.t('COMMON.SUCCESS'),
      message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
    });

    this.setState({ filterSetLoading: false });
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

  handleToggleFiltersFormVisibility = () => (
    this.setState(({ filtersVisible }) => ({
      filtersVisible: !filtersVisible,
    }), this.props.handleToggleFiltersVisibility())
  );

  render() {
    const {
      common,
      favourite,
      selectValue,
      errorLoading,
      filtersLoading,
      isDataLoading,
    } = this.props;

    const {
      filtersVisible,
      isOpenDropdown,
      searchInputValue,
      filterSetLoading,
      sortedByFavorites,
    } = this.state;

    const filtersList = [...favourite, ...common];

    const isDisabledDropdown = filtersLoading || errorLoading || filterSetLoading || (filtersList.length === 0);

    const dropdownOptions = searchInputValue
      ? filtersList.filter(({ name }) => name.toLowerCase().includes(searchInputValue.toLowerCase()))
      : filtersList;

    const sortedDropdownOptions = sortedByFavorites
      ? dropdownOptions.sort((a, b) => b.favourite - a.favourite)
      : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name));

    const activeFilter = filtersList.find(({ uuid }) => uuid === selectValue);
    const activeFilterName = activeFilter ? activeFilter.name : I18n.t('COMMON.SELECT_OPTION.DEFAULT');

    return (
      <div className={classNames('filter-favorites', { 'is-filters-visible': filtersVisible })}>
        <div className="filter-favorites__dropdown-container">
          <Dropdown
            className={
              classNames('filter-favorites__dropdown', { 'is-disabled': isDisabledDropdown || isDataLoading })
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
                    <Choose>
                      <When condition={activeFilter}>
                        <div className="filter-favorites__dropdown-list-top">
                          <div className="filter-favorites__dropdown-list-title">
                            Selected options
                          </div>
                        </div>
                        <FilterSelectOption
                          filter={activeFilter}
                          key={activeFilter.uuid}
                          activeId={selectValue}
                          handleSelectFilter={this.handleSetFilterValues}
                          handleUpdateFavorite={this.handleUpdateFavorite}
                        />
                      </When>
                    </Choose>

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
                      .filter(item => item !== activeFilter)
                      .map(filter => (
                        <FilterSelectOption
                          filter={filter}
                          key={filter.uuid}
                          activeId={selectValue}
                          handleSelectFilter={this.handleSetFilterValues}
                          handleUpdateFavorite={this.handleUpdateFavorite}
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

        <div
          className={classNames(
            'filter-switcher',
            { 'is-closed': !filtersVisible },
          )}
          onClick={this.handleToggleFiltersFormVisibility}
        >
          <SwitcherIcon />
        </div>
      </div>
    );
  }
}

export default FilterSet;
