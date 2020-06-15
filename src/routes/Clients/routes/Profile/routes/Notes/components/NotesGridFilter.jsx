import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { get, omit } from 'lodash';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import I18n from 'i18n-js';
import { authoritiesOptionsQuery } from 'graphql/queries/auth';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import { departmentsLabels } from 'constants/operators';
import { DateTimeField, RangeGroup, NasSelectField } from 'components/ReduxForm';
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
    authoritiesOptions: PropTypes.shape({
      authoritiesOptions: PropTypes.shape({
        data: PropTypes.shape({
          authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
        }),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
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
      authoritiesOptions: {
        authoritiesOptions,
        loading,
      },
      onSubmit,
      invalid,
    } = this.props;

    const allDepartmentRoles = get(authoritiesOptions, 'data.authoritiesOptions') || {};
    const departmentRoles = omit(allDepartmentRoles, ['PLAYER', 'AFFILIATE']);

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="department"
          label={I18n.t(attributeLabels.department)}
          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
          component={NasSelectField}
          className="filter-row__medium"
          disabled={loading}
          withAnyOption
          searchable
        >
          {Object.keys(departmentRoles).map(department => (
            <option key={department} value={department}>
              {I18n.t(renderLabel(department, departmentsLabels))}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('PLAYER_PROFILE.NOTES.FILTER.LABELS.CREATION_DATE_RANGE')}
        >
          <Field
            utc
            name="changedAtFrom"
            placeholder={I18n.t(attributeLabels.from)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
          />
          <Field
            utc
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

const FORM_NAME = 'userNotesFilter';

export default compose(
  connect(state => ({
    currentValues: getFormValues(FORM_NAME)(state),
  })),
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
    validate: values => createValidator({
      changedAtFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
      changedAtTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    }, translateLabels(attributeLabels), false)(values),
  }),
  graphql(authoritiesOptionsQuery, { name: 'authoritiesOptions' }),
)(NotesGridFilter);
