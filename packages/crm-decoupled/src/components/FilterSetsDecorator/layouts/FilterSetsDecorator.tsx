import React from 'react';
import { FormikValues } from 'formik';
import { Types } from '@crm/common';
import { FilterSet__Types__Enum as FilterSetType } from '__generated__/types';
import { FormValues as ClientFilterSet } from 'routes/Clients/routes/ClientsList/types';
import { FiltersFormValues as PaymentFilterSet } from 'components/PaymentsListFilters';
import useFilterSetsDecorator from '../hooks/useFilterSetsDecorator';
import FilterSets from './components/FilterSets';
import './FilterSetsDecorator.scss';

type Props = {
  children: React.ReactNode,
  filterSetType: FilterSetType,
  currentValues: FormikValues,
  disabled?: boolean,
  renderBefore?: React.ReactNode,
  isOldClientsGridFilterPanel?: boolean,
  submitFilters: (filterSet: PaymentFilterSet | ClientFilterSet) => void,
};

export const FilterSetsContext = React.createContext({} as Types.FilterSetContext);

const FilterSetsDecorator = (props: Props) => {
  const {
    children,
    filterSetType,
    currentValues,
    disabled,
    isOldClientsGridFilterPanel,
    renderBefore,
    submitFilters,
  } = props;

  const {
    areButtonsVisible,
    selectedFilterSetUuid,
    filterSetsListDisabled,
    createFilterSet,
    updateFilterSet,
    deleteFilterSet,
    filterSetsList,
    fetchFilterSetByUuid,
    updateFavouriteFilterSet,
  } = useFilterSetsDecorator({
    filterSetType,
    currentValues,
    disabled,
    isOldClientsGridFilterPanel,
    submitFilters,
  });

  return (
    <FilterSetsContext.Provider
      value={{
        visible: areButtonsVisible,
        hasSelectedFilterSet: !!selectedFilterSetUuid,
        disabled: filterSetsListDisabled,
        createFilterSet,
        updateFilterSet,
        deleteFilterSet,
      }}
    >
      <div className="FilterSetsDecorator__control">
        {renderBefore}

        <FilterSets
          filterSetsList={filterSetsList}
          selectedFilterSetUuid={selectedFilterSetUuid}
          disabled={filterSetsListDisabled}
          selectFilterSet={fetchFilterSetByUuid}
          updateFavouriteFilterSet={updateFavouriteFilterSet}
        />
      </div>

      {children}
    </FilterSetsContext.Provider>
  );
};

export default React.memo(FilterSetsDecorator);
