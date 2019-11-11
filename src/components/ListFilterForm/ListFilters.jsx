import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { isEqual } from 'lodash';
import history from 'router/history';
import FilterSet from '../FilterSet';
import FilterSetButtons from '../FilterSetButtons';
import reduxFieldsConstructor from '../ReduxForm/ReduxFieldsConstructor';

class ListFilters extends PureComponent {
  static propTypes = {
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
    isFetchingProfileData: PropTypes.bool.isRequired,
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
  }

  handleReset = () => {
    const { reset, onReset, filterSetType, isFetchingProfileData } = this.props;

    if (isFetchingProfileData) {
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
    const { isFetchingProfileData } = this.props;

    let requestId = null;

    if (isFetchingProfileData) {
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
    let { location: { query } } = history;

    if (!filterSetValues) {
      query = null;
    }

    return history.replace({ query, filterSetValues });
  }

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
      isFetchingProfileData,
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
            type={filterSetType}
            submitFilters={this.handleSubmit}
            selectValue={selectedFilterDropdownItem}
            isFetchingProfileData={isFetchingProfileData}
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
                  type={filterSetType}
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

export default ListFilters;
