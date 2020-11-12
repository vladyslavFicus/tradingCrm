import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import { Formik, Form } from 'formik';
import PropTypes from 'constants/propTypes';
import { Button, RefreshButton } from 'components/UI';
import FilterSet from 'components/FilterSet';
import FilterSetButtons from 'components/FilterSetButtons';

class ExtendedForm extends PureComponent {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleReset: PropTypes.func,
    filterSetType: PropTypes.string.isRequired,
    isDataLoading: PropTypes.bool,
    children: PropTypes.func.isRequired,
    enableReinitialize: PropTypes.bool,
    validate: PropTypes.func,
    handleRefetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialValues: {},
    handleReset: () => {},
    isDataLoading: false,
    enableReinitialize: false,
    validate: null,
  };

  state = {
    prevValues: null,
    isFiltersVisible: true,
    selectedFilterDropdownItem: '',
  };

  handleSubmit = (values, formikBag) => {
    const { prevValues } = this.state;
    const { isDataLoading, handleSubmit } = this.props;

    if (isDataLoading) {
      return;
    }

    // Hack to make refetch if APPLY clicked and filters remained same
    let requestId = null;
    if (isEqual(prevValues, values)) {
      requestId = Math.random().toString(36).slice(2);
    }

    handleSubmit({ ...values, ...(requestId && { requestId }) }, formikBag);

    this.setState({ prevValues: values });
  };

  handleReset = (resetForm) => {
    const { handleReset, isDataLoading } = this.props;

    if (isDataLoading) {
      return;
    }

    handleReset();
    resetForm({});

    this.setState({ selectedFilterDropdownItem: '' });
  };

  handleSelectFilterDropdownItem = (uuid) => {
    this.setState({ selectedFilterDropdownItem: uuid });
  };

  handleToggleFiltersVisibility = () => (
    this.setState(({ isFiltersVisible }) => ({
      isFiltersVisible: !isFiltersVisible,
    }))
  );

  render() {
    const {
      enableReinitialize,
      filterSetType,
      isDataLoading,
      validate,
      children,
      initialValues,
      handleRefetch,
    } = this.props;

    const {
      isFiltersVisible,
      selectedFilterDropdownItem,
    } = this.state;

    return (
      <Formik
        enableReinitialize={enableReinitialize}
        initialValues={initialValues}
        onSubmit={this.handleSubmit}
        validate={validate}
      >
        {({
          values,
          dirty,
          setValues,
          handleReset,
          resetForm,
          ...formikBag
        }) => (
          <Fragment>
            <FilterSet
              filterSetType={filterSetType}
              selectValue={selectedFilterDropdownItem}
              isDataLoading={isDataLoading}
              submitFilters={this.handleSubmit}
              handleHistoryReplace={query => setValues(query)}
              handleToggleFiltersVisibility={this.handleToggleFiltersVisibility}
              handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
            />
            <If condition={isFiltersVisible}>
              <Form className="filter__form">
                <div className="filter__form-inputs">
                  {children({
                    values,
                    dirty,
                    setValues,
                    handleReset,
                    ...formikBag,
                  })}
                </div>
                <div className="filter__form-buttons">
                  <FilterSetButtons
                    resetForm={handleReset}
                    filterSetType={filterSetType}
                    currentValues={values}
                    selectValue={selectedFilterDropdownItem}
                    handleHistoryReplace={handleReset}
                    handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
                  />

                  <div className="filter__form-buttons-group">
                    <If condition={handleRefetch}>
                      <RefreshButton onClick={handleRefetch} />
                    </If>

                    <Button
                      disabled={isDataLoading}
                      onClick={() => this.handleReset(resetForm)}
                      primary
                    >
                      {I18n.t('COMMON.RESET')}
                    </Button>

                    <Button
                      disabled={isDataLoading || !dirty}
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

export default ExtendedForm;
