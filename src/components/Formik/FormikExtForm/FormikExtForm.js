import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import { Formik, Form } from 'formik';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
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
  };

  static defaultProps = {
    initialValues: {},
    handleReset: () => {},
    isDataLoading: false,
  };

  state = {
    prevValues: null,
    isFiltersVisible: true,
    selectedFilterDropdownItem: '',
  };

  handleSubmit = (values) => {
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

    handleSubmit({ ...values, ...(requestId && { requestId }) });

    this.setState({ prevValues: values });
  };

  handleReset = () => {
    const { handleReset, isDataLoading } = this.props;

    if (isDataLoading) {
      return;
    }

    handleReset();

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
      filterSetType,
      isDataLoading,
      children,
      initialValues,
    } = this.props;

    const {
      isFiltersVisible,
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
          setValues,
          handleReset,
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
                    currentValues={dirty ? values : null}
                    selectValue={selectedFilterDropdownItem}
                    handleHistoryReplace={handleReset}
                    handleSelectFilterDropdownItem={this.handleSelectFilterDropdownItem}
                  />

                  <div className="filter__form-buttons-group">
                    <Button
                      disabled={!dirty || isDataLoading}
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

export default ExtendedForm;
