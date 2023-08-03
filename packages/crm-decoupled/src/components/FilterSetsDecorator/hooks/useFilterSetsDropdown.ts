import React, { useCallback, useMemo, useState } from 'react';
import { FilterSet__Option as FilterSetsList } from '__generated__/types';

type UseFilterSetsDropdown = {
  searchFilterSet: ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => void,
  resetSearch: () => void,
  sortByFavorite: () => void,
  sortedByFavorites: boolean,
  searchValue: string,
  dropdownOptions: Array<FilterSetsList>,
  sortedDropdownOptions: Array<FilterSetsList>,
};

const useFilterSetsDropdown = (filterSetsList: Array<FilterSetsList>): UseFilterSetsDropdown => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortedByFavorites, setSortedByFavorites] = useState(false);

  const searchFilterSet = useCallback(({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchValue('');
  }, []);

  const sortByFavorite = useCallback(() => setSortedByFavorites(prevSortedByFavorites => !prevSortedByFavorites), []);

  const searchValueLower = searchValue.toLocaleLowerCase();

  const dropdownOptions = useMemo(() => (searchValue
    ? filterSetsList.filter(({ name }) => name.toLowerCase().includes(searchValueLower))
    : filterSetsList),
  [searchValue, filterSetsList, searchValueLower]);

  const sortedDropdownOptions = useMemo(() => (sortedByFavorites
    ? dropdownOptions.sort((a, b) => Number(b.favourite) - Number(a.favourite))
    : dropdownOptions.sort((a, b) => a.name.localeCompare(b.name))),
  [dropdownOptions, sortedByFavorites]);

  return {
    searchFilterSet,
    resetSearch,
    sortByFavorite,
    sortedByFavorites,
    searchValue,
    dropdownOptions,
    sortedDropdownOptions,
  };
};

export default useFilterSetsDropdown;
