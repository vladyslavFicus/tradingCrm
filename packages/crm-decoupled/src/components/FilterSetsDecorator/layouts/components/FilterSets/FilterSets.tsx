import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FilterSet__Option as FilterSetsList } from '__generated__/types';
import useFilterSets from 'components/FilterSetsDecorator/hooks/useFilterSets';
import FilterSetsDropdown from './components/FilterSetsDropdown';
import './FilterSets.scss';

type Props = {
  filterSetsList: Array<FilterSetsList>,
  selectedFilterSetUuid?: string,
  disabled?: boolean,
  selectFilterSet: (uuid: string) => void,
  updateFavouriteFilterSet: (uuid: string, favourite: boolean) => void,
};

const FilterSets = (props: Props) => {
  const {
    updateFavouriteFilterSet,
    filterSetsList,
    selectedFilterSetUuid = '',
    selectFilterSet: selectFilter,
    disabled,
  } = props;

  const {
    open,
    activeFilterSet,
    activeFilterSetName,
    selectFilterSet,
    toggleDropdown,
  } = useFilterSets({ selectFilter, filterSetsList, selectedFilterSetUuid });

  return (
    <div
      className={
          classNames('FilterSets', {
            'FilterSets--disabled': disabled,
            'FilterSets--unfolded': open,
            'FilterSets--inactive': !activeFilterSet,
          })
        }
    >
      <Dropdown
        className="FilterSets__dropdown"
        toggle={toggleDropdown}
        isOpen={open}
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

        <DropdownMenu className="FilterSets__dropdown" end>
          <FilterSetsDropdown
            filterSetsList={filterSetsList}
            activeFilterSet={activeFilterSet}
            selectFilterSet={selectFilterSet}
            updateFavouriteFilterSet={updateFavouriteFilterSet}
          />
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default React.memo(FilterSets);
