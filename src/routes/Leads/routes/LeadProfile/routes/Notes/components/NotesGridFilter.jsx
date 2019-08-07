import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import { DateTimeField, RangeGroup } from '../../../../../../../components/ReduxForm';
import { attributeLabels } from '../constants';

class NotesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      changedAtTo: PropTypes.string,
      changedAtFrom: PropTypes.string,
    }),
    invalid: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentValues: {},
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.changedAtTo
      ? current.isSameOrBefore(moment(currentValues.changedAtTo))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.changedAtFrom
      ? current.isSameOrAfter(moment(currentValues.changedAtFrom))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      invalid,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('LEAD_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
        >
          <Field
            name="changedAtFrom"
            placeholder={I18n.t(attributeLabels.from)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
          />
          <Field
            name="changedAtTo"
            placeholder={I18n.t(attributeLabels.to)}
            component={DateTimeField}
            isValidDate={this.endDateValidator}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
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
    );
  }
}

const FORM_NAME = 'leadNotesFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: values => createValidator({
    changedAtFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    changedAtTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  }, translateLabels(attributeLabels), false)(values),
})(NotesGridFilter));
