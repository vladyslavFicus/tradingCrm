import { useCallback, useMemo, useState } from 'react';
import I18n from 'i18n-js';
import { FilterSet__Option as FilterSetsList } from '__generated__/types';

type Props = {
  filterSetsList: Array<FilterSetsList>,
  selectFilter: (uuid: string) => void,
  selectedFilterSetUuid?: string,
}

type UseFilterSets = {
  open: boolean,
  activeFilterSet?: FilterSetsList,
  activeFilterSetName: string,
  selectFilterSet: (uuid: string) => void,
  toggleDropdown: () => void,
};

const useFilterSets = (props: Props): UseFilterSets => {
  const { selectFilter, filterSetsList, selectedFilterSetUuid } = props;

  const [open, setOpen] = useState(false);

  const toggleDropdown = useCallback(() => setOpen(prevOpen => !prevOpen), []);

  const selectFilterSet = useCallback((uuid: string) => {
    toggleDropdown();
    selectFilter(uuid);
  }, [selectFilter, toggleDropdown]);

  const activeFilterSet = useMemo(() => filterSetsList.find(({ uuid }) => uuid === selectedFilterSetUuid),
    [filterSetsList, selectedFilterSetUuid]);
  const activeFilterSetName = activeFilterSet?.name || I18n.t('COMMON.SELECT_OPTION.DEFAULT');

  return {
    open,
    activeFilterSet,
    activeFilterSetName,
    selectFilterSet,
    toggleDropdown,
  };
};

export default useFilterSets;
