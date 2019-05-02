import React, { Component } from 'react';
import { getFormValues, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { isEqual } from 'lodash';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import reduxFieldsConstructor, { getValidationRules } from '../ReduxForm/ReduxFieldsConstructor';

class ListFilters extends Component {
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
  };

  static defaultProps = {
    invalid: true,
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    currentValues: null,
    onFieldChange: () => {},
  };

  static contextTypes = {
    getApolloRequestState: PropTypes.func,
  };

  state = {
    resetDisabled: true,
    prevValues: null,
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
    this.setState({ resetDisabled: true });
  };

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
  }

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      invalid,
      fields,
    } = this.props;
    const { resetDisabled } = this.state;

    return (
      <form className="filter-row" onSubmit={handleSubmit(this.handleSubmit)}>
        {reduxFieldsConstructor(fields, this.handleSelectFieldChange, this.startDateValidator, this.endDateValidator)}
        <div className="filter-row__button-block">
          <button
            disabled={resetDisabled || submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || pristine || invalid}
            className="btn btn-primary"
            type="submit"
            id="transactions-list-filters-apply-button"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
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
}))(ListFilterForm);
