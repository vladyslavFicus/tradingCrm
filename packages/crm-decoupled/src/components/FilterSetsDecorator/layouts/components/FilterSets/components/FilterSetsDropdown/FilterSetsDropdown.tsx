import React from 'react';
import I18n from 'i18n-js';
import { FilterSet__Option as FilterSetsList } from '__generated__/types';
import useFilterSetsDropdown from 'components/FilterSetsDecorator/hooks/useFilterSetsDropdown';
import {
  ReactComponent as FavoriteStarIcon,
} from 'components/FilterSetsDecorator/layouts/icons/favorites-star.svg';
import FilterSetsOption from './components/FilterSetsOption';
import FilterSetsSearch from './components/FilterSetsSearch';
import './FilterSetsDropdown.scss';

type Props = {
  filterSetsList: Array<FilterSetsList>,
  activeFilterSet?: FilterSetsList,
  selectFilterSet: (uuid: string) => void,
  updateFavouriteFilterSet: (uuid: string, favourite: boolean) => void,
};

const FilterSetsDropdown = (props: Props) => {
  const {
    filterSetsList,
    activeFilterSet,
    selectFilterSet,
    updateFavouriteFilterSet,
  } = props;

  const {
    searchFilterSet,
    resetSearch,
    sortByFavorite,
    sortedByFavorites,
    searchValue,
    dropdownOptions,
    sortedDropdownOptions,
  } = useFilterSetsDropdown(filterSetsList);

  return (
    <>
      <FilterSetsSearch
        value={searchValue}
        onReset={resetSearch}
        onChange={searchFilterSet}
      />

      <Choose>
        <When condition={!!dropdownOptions.length}>
          <div className="FilterSetsDropdown__list">
            <If condition={!!activeFilterSet}>
              <div className="FilterSetsDropdown__list-row">
                {I18n.t('FILTER_SET.DROPDOWN.LIST.SELECTED')}
              </div>

              <FilterSetsOption
                filterSet={activeFilterSet || {} as FilterSetsList}
                updateFavouriteFilterSet={updateFavouriteFilterSet}
              />
            </If>

            <div className="FilterSetsDropdown__list-row">
              {I18n.t('FILTER_SET.DROPDOWN.LIST.TITLE')}

              <div
                className="FilterSetsDropdown__list-sort"
                onClick={sortByFavorite}
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
              .filter(({ uuid }) => uuid !== activeFilterSet?.uuid)
              .map(filterSet => (
                <FilterSetsOption
                  key={filterSet.uuid}
                  filterSet={filterSet}
                  selectFilterSet={selectFilterSet}
                  updateFavouriteFilterSet={updateFavouriteFilterSet}
                />
              ))}
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
};

export default React.memo(FilterSetsDropdown);
