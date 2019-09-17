import React, { PureComponent, Fragment } from 'react';
import { getFormValues, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { isEqual } from 'lodash';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import FilterSet from '../FilterSet';
import reduxFieldsConstructor, { getValidationRules } from '../ReduxForm/ReduxFieldsConstructor';

class ListFilters extends PureComponent {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    invalid: PropTypes.bool,
    change: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    onFieldChange: PropTypes.func,
    filterSetType: PropTypes.string,
    queryRequestInProgress: PropTypes.bool,
  };

  static defaultProps = {
    invalid: true,
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    currentValues: null,
    filterSetType: null,
    onFieldChange: () => {},
    queryRequestInProgress: false,
  };

  static contextTypes = {
    getApolloRequestState: PropTypes.func,
  };

  state = {
    resetDisabled: true,
    visible: true,
    prevValues: null,
  };

  resetFilterSet = null;

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
    const { change, currentValues } = this.props;

    this.props.onFieldChange(fieldName, value, change, currentValues);
  }

  handleReset = () => {
    const { getApolloRequestState } = this.context;
    // do nothing if request is already performing
    if (getApolloRequestState && getApolloRequestState()) {
      return;
    }

    this.props.reset();
    this.props.onReset();

    if (this.props.filterSetType) {
      this.resetFilterSet();
    }

    this.setState({ resetDisabled: true });
  };

  handleToggleVisibility = () => (
    this.setState(({ visible }) => ({
      visible: !visible,
    }))
  );

  handleSubmit = (values) => {
    const { prevValues } = this.state;
    const { getApolloRequestState } = this.context;
    let requestId = null;

    // do nothing if request is already performing
    if (getApolloRequestState && getApolloRequestState()) {
      return;
    }

    // Hack to make refetch if APPLY clicked and filters remained same
    if (isEqual(prevValues, values)) {
      requestId = Math.random().toString(36).slice(2);
    }

    this.props.onSubmit({ ...values, ...(requestId && { requestId }) });

    this.setState({ prevValues: values });

    if (this.state.resetDisabled) this.setState({ resetDisabled: false });
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      invalid,
      change,
      fields,
      reset,
      currentValues,
      filterSetType,
      queryRequestInProgress,
    } = this.props;

    const { resetDisabled, visible } = this.state;

    const disabled = pristine ? resetDisabled : false;

    return (
      <Fragment>
        <If condition={filterSetType}>
          <FilterSet
            type={filterSetType}
            currentFormValues={currentValues}
            toggleVisibility={this.handleToggleVisibility}
            formChange={change}
            resetForm={reset}
            resetFilterSet={(func) => { this.resetFilterSet = func; }}
            submitFilters={this.handleSubmit}
            apolloRequestInProgress={queryRequestInProgress}
          />
        </If>
        <If condition={visible}>
          <form className="filter-row" onSubmit={handleSubmit(this.handleSubmit)}>
            {reduxFieldsConstructor(
              fields,
              this.handleSelectFieldChange,
              this.startDateValidator,
              this.endDateValidator,
            )}
            <div className="filter-row__button-block">
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
          </form>
        </If>
      </Fragment>
    );
  }
}

const FORM_NAME = `listFiltersFrom-${Math.random().toString(36).slice(8)}`;

const ListFilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: (values, { fields }) => createValidator(getValidationRules(fields), false)(values),
})(ListFilters);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
  enableReinitialize: true,
}))(ListFilterForm);
