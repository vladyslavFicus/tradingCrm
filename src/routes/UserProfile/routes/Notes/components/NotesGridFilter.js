import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../../components/ReduxForm';
import { targetTypesLabels } from '../../../../../constants/note';
import { attributeLabels } from '../constants';

class NotesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchValue: PropTypes.string,
      targetType: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string,
    }),
    availableTypes: PropTypes.arrayOf(PropTypes.string),
    invalid: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentValues: {},
    availableTypes: [],
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.to
      ? current.isSameOrBefore(moment(currentValues.to))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.from
      ? current.isSameOrAfter(moment(currentValues.from))
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
      availableTypes,
      invalid,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="searchValue"
                type="text"
                label={'Search by'}
                placeholder={I18n.t(attributeLabels.searchValue)}
                component={InputField}
                position="vertical"
                inputAddon={<i className="nas nas-search_icon" />}
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="targetType"
                label={I18n.t(attributeLabels.targetType)}
                component={SelectField}
                position="vertical"
              >
                <option value="">All types</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {targetTypesLabels[type] || type}
                  </option>
                ))}
              </Field>
            </div>
            <RangeGroup
              className="filter-row__big"
              label={I18n.t('PLAYER_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
            >
              <Field
                name="from"
                placeholder={I18n.t(attributeLabels.from)}
                component={DateTimeField}
                isValidDate={this.startDateValidator}
                timeFormat={null}
                position="vertical"
              />
              <Field
                name="to"
                placeholder={I18n.t(attributeLabels.to)}
                component={DateTimeField}
                isValidDate={this.endDateValidator}
                timeFormat={null}
                position="vertical"
              />
            </RangeGroup>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
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
          </div>
        </form>
      </div>
    );
  }
}

const FORM_NAME = 'userNotesFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
    validate: (values, props) => createValidator({
      searchValue: 'string',
      targetType: ['string', `in:,${props.availableTypes.join()}`],
      from: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
      to: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    }, translateLabels(attributeLabels), false)(values),
  })(NotesGridFilter),
);
