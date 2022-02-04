import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import FilterSetsDropdown from './components/FilterSetsDropdown';
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

  render() {
    const {
      updateFavouriteFilterSet,
      filterSetsList,
      selectedFilterSet,
      disabled,
    } = this.props;

    const { isOpen } = this.state;

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

          <DropdownMenu className="FilterSets__dropdown" end>
            <FilterSetsDropdown
              filterSetsList={filterSetsList}
              activeFilterSet={activeFilterSet}
              selectFilterSet={this.selectFilterSet}
              updateFavouriteFilterSet={updateFavouriteFilterSet}
            />
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default FilterSets;
