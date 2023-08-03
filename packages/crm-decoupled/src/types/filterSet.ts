export type FilterSetContext = {
  visible: boolean,
  hasSelectedFilterSet: boolean,
  disabled: boolean,
  createFilterSet: () => void,
  updateFilterSet: () => void,
  deleteFilterSet: () => void,
};
