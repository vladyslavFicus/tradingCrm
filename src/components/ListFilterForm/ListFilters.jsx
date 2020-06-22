import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { isEqual } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import FilterSet from '../FilterSet';
import FilterSetButtons from '../FilterSetButtons';
import reduxFieldsConstructor from '../ReduxForm/ReduxFieldsConstructor';

class ListFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    reset: PropTypes.func,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onFieldChange: PropTypes.func,
    filterSetType: PropTypes.string,
    currentValues: PropTypes.object,
    change: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isDataLoading: PropTypes.bool,
  };

  static defaultProps = {
    reset: null,
    invalid: true,
    pristine: false,
    submitting: false,
    handleSubmit: null,
    currentValues: null,
    filterSetType: null,
    onFieldChange: () => {},
    isDataLoading: false,
  };

  state = {
    prevValues: null,
    resetDisabled: true,
    isFiltersVisible: true,
    selectedFilterDropdownItem: '',
  };

  resetFilterSet = () => {
    this.setState({ selectedFilterDropdownItem: '' });
  };

  startDateValidator = fieldName => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fieldName]
      ? current.isSameOrBefore(moment(currentValues[fieldName]))
      : current.isSameOrBefore(moment());
  };

  endDateValidator = fieldName => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fieldName]
      ? current.isSameOrAfter(moment(currentValues[fieldName]))
      : true;
  };

  handleSelectFieldChange = fieldName => (value) => {
    const { change, currentValues, onFieldChange } = this.props;
    onFieldChange(fieldName, value, change, currentValues);
  };

  handleReset = () => {
    const { reset, onReset, filterSetType, isDataLoading } = this.props;

    if (isDataLoading) {
      return;
    }

    reset();
    onReset();

    if (filterSetType) {
      this.resetFilterSet();
    }

    this.setState({ resetDisabled: true });
  };

  handleSubmit = (values) => {
    const { prevValues, resetDisabled } = this.state;
    const { isDataLoading } = this.props;

    let requestId = null;

    if (isDataLoading) {
      return;
    }

    // Hack to make refetch if APPLY clicked and filters remained same
    if (isEqual(prevValues, values)) {
      requestId = Math.random().toString(36).slice(2);
    }

    this.props.onSubmit({ ...values, ...(requestId && { requestId }) });

    this.setState({ prevValues: values });

    if (resetDisabled) {
      this.setState({ resetDisabled: false });
    }
  };

  handleSelectFilterDropdownItem = (uuid) => {
    this.setState({ selectedFilterDropdownItem: uuid });
  };

  // the function needed to update filterSetValues in parent component
  handleHistoryReplace = (filterSetValues = null) => {
    let { location: { query } } = this.props.history;

    if (!filterSetValues) {
      query = null;
    }

    return this.props.history.replace({ query, filterSetValues });
  };

  handleToggleFiltersVisibility = () => (
    this.setState(({ isFiltersVisible }) => ({
      isFiltersVisible: !isFiltersVisible,
    }))
  );

  render() {
    const {
      reset,
      change,
      fields,
      invalid,
      pristine,
      submitting,
      handleSubmit,
      currentValues,
      filterSetType,
      isDataLoading,
    } = this.props;

    const {
      isFiltersVisible,
      resetDisabled,
      selectedFilterDropdownItem,
    } = this.state;

    const disabled = pristine ? resetDisabled : false;

    return (
      <Fragment>
        <If condition={filterSetType}>
          <FilterSet
            resetForm={reset}
            filterSetType={filterSetType}
            submitFilters={this.handleSubmit}
            selectValue={selectedFilterDropdownItem}
            isDataLoading={isDataLoading}
            handleHistoryReplace={this.handleHistoryReplace}
            handleToggleFiltersVisibility={this.handleToggleFiltersVisibility}
            handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
          />
        </If>
        <If condition={isFiltersVisible}>
          <form className="filter__form" onSubmit={handleSubmit(this.handleSubmit)}>
            <div className="filter__form-inputs">
              {reduxFieldsConstructor(
                fields,
                this.handleSelectFieldChange,
                this.startDateValidator,
                this.endDateValidator,
              )}
            </div>
            <div className="filter__form-buttons">
              <If condition={filterSetType}>
                <FilterSetButtons
                  resetForm={reset}
                  formChange={change}
                  filterSetType={filterSetType}
                  currentValues={currentValues}
                  selectValue={selectedFilterDropdownItem}
                  handleHistoryReplace={this.handleHistoryReplace}
                  handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
                />
              </If>

              <div className="filter__form-buttons-group">
                <button
                  disabled={disabled || submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="button"
                >
                  {I18n.t('COMMON.RESET')}
                </button>

                <button
                  disabled={submitting || invalid}
                  className="btn btn-primary"
                  type="submit"
                >
                  {I18n.t('COMMON.APPLY')}
                </button>
              </div>
            </div>
          </form>
        </If>
      </Fragment>
    );
  }
}

export default withRouter(ListFilters);
