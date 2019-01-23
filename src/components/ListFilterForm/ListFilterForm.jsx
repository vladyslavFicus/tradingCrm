import React, { Component } from 'react';
import { getFormValues, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
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
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      onSubmit,
      invalid,
      fields,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        {reduxFieldsConstructor(fields, this.handleSelectFieldChange, this.startDateValidator, this.endDateValidator)}
        <div className="filter-row__button-block">
          <button
            disabled={submitting || pristine}
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
