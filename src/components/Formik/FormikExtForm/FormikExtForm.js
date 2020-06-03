import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import FilterSet from 'components/FilterSet';
import FilterSetButtons from 'components/FilterSetButtons';

class ExtendedForm extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleReset: PropTypes.func,
    filterSetType: PropTypes.string.isRequired,
    isDataLoading: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValues: {},
    handleReset: () => {},
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

    this.props.handleSubmit({ ...values, ...(requestId && { requestId }) });

    this.setState({ prevValues: values });

    if (resetDisabled) {
      this.setState({ resetDisabled: false });
    }
  };

  handleReset = () => {
    const { handleReset, filterSetType, isDataLoading } = this.props;

    if (isDataLoading) {
      return;
    }

    handleReset();

    if (filterSetType) {
      this.resetFilterSet();
    }

    this.setState({ resetDisabled: true });
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
      filterSetType,
      isDataLoading,
      children,
      initialValues,
    } = this.props;

    const {
      isFiltersVisible,
      resetDisabled,
      selectedFilterDropdownItem,
    } = this.state;

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        {({
          values,
          dirty,
          handleReset,
          ...formikBag
        }) => (
          <Fragment>
            <FilterSet
              filterSetType={filterSetType}
              selectValue={selectedFilterDropdownItem}
              isDataLoading={isDataLoading}
              submitFilters={this.handleSubmit}
              handleHistoryReplace={this.handleHistoryReplace}
              handleToggleFiltersVisibility={this.handleToggleFiltersVisibility}
              handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
            />
            <If condition={isFiltersVisible}>
              <Form className="filter__form">
                <div className="filter__form-inputs">
                  {children({
                    values,
                    dirty,
                    handleReset,
                    ...formikBag,
                  })}
                </div>
                <div className="filter__form-buttons">
                  <If condition={filterSetType}>
                    <FilterSetButtons
                      resetForm={handleReset}
                      filterSetType={filterSetType}
                      currentValues={dirty ? values : null}
                      selectValue={selectedFilterDropdownItem}
                      handleHistoryReplace={this.handleHistoryReplace}
                      handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
                    />
                  </If>

                  <div className="filter__form-buttons-group">
                    <Button
                      disabled={!dirty || resetDisabled || isDataLoading}
                      onClick={handleReset}
                      common
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      disabled={isDataLoading}
                      className="margin-left-15"
                      type="submit"
                      primary
                    >
                      {I18n.t('COMMON.APPLY')}
                    </Button>
                  </div>
                </div>
              </Form>
            </If>
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default withRouter(ExtendedForm);
