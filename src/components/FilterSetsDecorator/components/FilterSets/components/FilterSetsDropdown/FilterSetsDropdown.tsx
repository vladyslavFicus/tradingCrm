import React, { useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { FilterSet__Option as FilterSetsList } from '__generated__/types';
import FilterSetsOption from './components/FilterSetsOption';
import FilterSetsSearch from './components/FilterSetsSearch';
import { ReactComponent as FavoriteStarIcon } from './icons/favorites-star.svg';
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

  const [searchValue, setSearchValue] = useState<string>('');
  const [sortedByFavorites, setSortedByFavorites] = useState(false);

  const searchFilterSet = ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
  };

  const resetSearch = () => {
    setSearchValue('');
  };

  const sortByFavorite = () => {
    setSortedByFavorites(!sortedByFavorites);
  };

  const dropdownOptions = useMemo(() => (searchValue
    ? filterSetsList.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
    : filterSetsList),
  [searchValue, filterSetsList]);

  const sortedDropdownOptions = useMemo(() => (sortedByFavorites
    ? dropdownOptions.sort((a, b) => Number(b.favourite) - Number(a.favourite))
    : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name))),
  [sortByFavorite, dropdownOptions]);

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
