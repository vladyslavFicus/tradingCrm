import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose, withApollo } from 'react-apollo';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import { withNotifications } from 'hoc';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import FilterSetsOption from './FilterSetsOption';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
import {
  FilterSetsQuery,
  filterSetByIdQuery,
  UpdateFavouriteFilterSetMutation,
} from '../../graphql';
import './FilterSets.scss';

class FilterSets extends PureComponent {
  static propTypes = {
    notify: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    filterSetsQuery: PropTypes.query({
      filterSets: PropTypes.shape({
        favourite: PropTypes.arrayOf(PropTypes.object),
        common: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    updateFavouriteFilterSetMutation: PropTypes.func.isRequired,
    filterSetType: PropTypes.string.isRequired,
    selectedFilter: PropTypes.string,
    disabled: PropTypes.bool,
    selectFilter: PropTypes.func.isRequired,
    submitFilters: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedFilter: '',
    disabled: false,
  };

  state = {
    sortedByFavorites: false,
    filterSetsLoading: false,
    isOpenDropdown: false,
    searchInputValue: '',
  };

  handleSetFilterValues = async (uuid) => {
    const {
      selectFilter,
      submitFilters,
      notify,
      client,
    } = this.props;

    this.setState({
      filterSetsLoading: true,
      isOpenDropdown: false,
    });

    try {
      const { data: { filterSet } } = await client.query({
        query: filterSetByIdQuery,
        variables: { uuid },
      });

      submitFilters(filterSet);

      selectFilter(uuid);
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('FILTER_SET.LOADING_FAILED'),
      });
    }

    this.setState({ filterSetsLoading: false });
  };

  handleUpdateFavorite = async (uuid, newValue) => {
    const {
      notify,
      updateFavouriteFilterSetMutation,
      filterSetsQuery: {
        refetch,
      },
      filterSetType,
    } = this.props;

    this.setState({ filterSetsLoading: true });

    try {
      await updateFavouriteFilterSetMutation({ variables: { uuid, favourite: newValue } });

      refetch({ type: filterSetType });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILTER_SET.UPDATE_FAVOURITE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('FILTER_SET.UPDATE_FAVOURITE.ERROR'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }

    this.setState({ filterSetsLoading: false });
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
      filterSetsQuery,
      selectedFilter,
      disabled,
    } = this.props;

    const {
      isOpenDropdown,
      searchInputValue,
      filterSetsLoading,
      sortedByFavorites,
    } = this.state;

    const {
      common,
      favourite,
    } = filterSetsQuery.data?.filterSets || {};

    const filtersList = [...(favourite || []), ...(common || [])];

    const isDisabledDropdown = filterSetsLoading || filterSetsQuery.error || !filtersList[0];

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
            classNames('filter-favorites__dropdown', { 'is-disabled': isDisabledDropdown || disabled })
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
                      <FilterSetsOption
                        filter={activeFilter}
                        key={activeFilter.uuid}
                        activeId={selectedFilter}
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
                      <FilterSetsOption
                        filter={filter}
                        key={filter.uuid}
                        activeId={selectedFilter}
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
    );
  }
}

export default compose(
  withNotifications,
  withApollo,
  withRequests({
    filterSetsQuery: FilterSetsQuery,
    updateFavouriteFilterSetMutation: UpdateFavouriteFilterSetMutation,
  }),
)(FilterSets);
