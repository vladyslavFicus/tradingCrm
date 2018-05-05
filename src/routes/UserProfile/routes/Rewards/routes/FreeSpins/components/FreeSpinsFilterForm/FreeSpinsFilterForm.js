import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { attributeLabels, attributePlaceholders } from './constants';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../../../../../components/ReduxForm';

class FreeSpinsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchBy: PropTypes.string,
      assign: PropTypes.string,
      providerId: PropTypes.string,
      gameId: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    games: PropTypes.arrayOf(PropTypes.string).isRequired,
    providers: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  static defaultProps = {
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    disabled: false,
    currentValues: {},
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      disabled,
      handleSubmit,
      onSubmit,
      providers,
      games,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t(attributeLabels.searchBy)}
          placeholder={I18n.t(attributePlaceholders.searchBy)}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="providerId"
          label={I18n.t(attributeLabels.providerId)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {providers.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
        <Field
          name="gameId"
          label={I18n.t(attributeLabels.gameId)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {games.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t(attributeLabels.availabilityDateRange)}
        >
          <Field
            name="startDate"
            placeholder={I18n.t(attributeLabels.startDate)}
            component={DateTimeField}
            isValidDate={this.startDateValidator('endDate')}
          />
          <Field
            name="endDate"
            placeholder={I18n.t(attributeLabels.endDate)}
            component={DateTimeField}
            isValidDate={this.endDateValidator('startDate')}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting || (disabled && pristine)}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || (disabled && pristine)}
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

const FORM_NAME = 'freeSpinsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    searchBy: 'string',
    aggregatorId: 'string',
    gameId: 'string',
    startDate: 'string',
    endDate: 'string',
  }, translateLabels(attributeLabels), false),
})(FreeSpinsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
