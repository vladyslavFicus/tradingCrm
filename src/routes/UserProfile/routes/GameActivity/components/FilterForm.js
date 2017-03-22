import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { createValidator } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { moneyTypeLabels } from '../../../../../constants/gaming-activity';
import config from '../../../../../config';
import { InputField, SelectField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'userGameActivityFilter';
const attributeLabels = {
  keyword: 'Search by',
  providers: 'Providers',
  games: 'Games',
  gameTypes: 'Game types',
  betTypes: 'Bet types',
  winTypes: 'Win types',
  startDate: 'Start date',
  endDate: 'End date',
};
const validate = createValidator({
  keyword: 'string',
  providers: ['string', `in:${Object.keys(config.providers).join()}`],
  games: ['string'],
  gameTypes: ['string'],
  betTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
  winTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
  startDate: 'string',
  endDate: 'string',
}, attributeLabels, false);

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    games: PropTypes.object.isRequired,
    gameCategories: PropTypes.object.isRequired,
    currentValues: PropTypes.object,
  };

  static defaultProps = {
    currentValues: {},
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <DateTime
        dateFormat="MM/DD/YYYY"
        timeFormat="HH:mm"
        onChange={this.handleDateTimeChange(input.onChange)}
        value={input.value ? moment(input.value) : null}
        closeOnSelect
        inputProps={{
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    </div>
  );

  renderTopFilters = () => {
    const {
      games,
      gameCategories,
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-3">
          <Field
            name="keyword"
            type="text"
            label={attributeLabels.keyword}
            labelClassName="form-label"
            placeholder={'Game round ID, Game ID, Provider ID'}
            component={InputField}
            position="vertical"
          />
        </div>
        <div className="col-md-2">
          <Field
            name="providers"
            label={attributeLabels.providers}
            labelClassName="form-label"
            emptyOptionLabel="Any"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">Any</option>
            {Object.keys(config.providers).map(item => (
              <option key={item} value={item}>
                {config.providers[item]}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="games"
            label={attributeLabels.games}
            labelClassName="form-label"
            emptyOptionLabel="Any"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">Any</option>
            {Object.keys(games).map(item => (
              <option key={item} value={item}>
                {games[item]}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="gameTypes"
            label={attributeLabels.gameTypes}
            labelClassName="form-label"
            emptyOptionLabel="Any"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">Any</option>
            {Object.keys(gameCategories).map(item => (
              <option key={item} value={item}>
                {gameCategories[item]}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="betTypes"
            label={attributeLabels.betTypes}
            labelClassName="form-label"
            emptyOptionLabel="Any"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">Any</option>
            {Object.keys(moneyTypeLabels).map(item => (
              <option key={item} value={item}>
                {moneyTypeLabels[item]}
              </option>
            ))}
          </Field>
        </div>
      </div>
    );
  };

  renderBottomFilters = () => (
    <div className="row">
      <div className="col-md-2">
        <Field
          name="winTypes"
          label={attributeLabels.winTypes}
          labelClassName="form-label"
          emptyOptionLabel="Any"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">Any</option>
          {Object.keys(moneyTypeLabels).map(item => (
            <option key={item} value={item}>
              {moneyTypeLabels[item]}
            </option>
          ))}
        </Field>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label className="form-label">Activity date range</label>
          <div className="row">
            <div className="col-md-5">
              <Field
                name="startDate"
                placeholder={attributeLabels.startDate}
                component={this.renderDateField}
                isValidDate={this.startDateValidator}
              />
            </div>
            <div className="col-md-5">
              <Field
                name="endDate"
                placeholder={attributeLabels.endDate}
                component={this.renderDateField}
                isValidDate={this.endDateValidator}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      reset,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-12">
              {this.renderTopFilters()}
            </div>
          </div>

          <div className="row">
            <div className="col-md-10">
              {this.renderBottomFilters()}
            </div>
            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={reset}
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FilterForm)
);
