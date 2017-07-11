import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../utils/validator';
import renderLabel from '../../../../../utils/renderLabel';
import PropTypes from '../../../../../constants/propTypes';
import { moneyTypeLabels } from '../../../../../constants/gaming-activity';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import { filterFormAttributeLabels } from '../constants';

const FORM_NAME = 'userGameActivityFilter';
const validate = createValidator({
  keyword: 'string',
  aggregators: ['string'],
  providers: ['string'],
  games: ['string'],
  gameTypes: ['string'],
  betTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
  winTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
  startDate: 'string',
  endDate: 'string',
}, filterFormAttributeLabels, false);

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    aggregators: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
    games: PropTypes.array.isRequired,
    gamesList: PropTypes.object.isRequired,
    gameCategories: PropTypes.object.isRequired,
    currentValues: PropTypes.object,
  };
  static defaultProps = {
    currentValues: {},
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

  renderTopFilters = () => {
    const {
      games,
      gameCategories,
      aggregators,
      gamesList,
      providers,
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-3">
          <Field
            name="keyword"
            type="text"
            label={I18n.t(filterFormAttributeLabels.keyword)}
            labelClassName="form-label"
            placeholder={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.FILTER_FORM.KEYWORD_INPUT_PLACEHOLDER')}
            component={InputField}
            position="vertical"
          />
        </div>
        <div className="col-md-2">
          <Field
            name="aggregators"
            label={I18n.t(filterFormAttributeLabels.aggregators)}
            labelClassName="form-label"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {aggregators.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="providers"
            label={I18n.t(filterFormAttributeLabels.providers)}
            labelClassName="form-label"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {providers.map(item => (
              <option key={item} value={item}>
                {providers}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="games"
            label={I18n.t(filterFormAttributeLabels.games)}
            labelClassName="form-label"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {games.map(item => (
              <option key={item} value={item}>
                {gamesList[item]}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-2">
          <Field
            name="gameTypes"
            label={I18n.t(filterFormAttributeLabels.gameTypes)}
            labelClassName="form-label"
            component={SelectField}
            position="vertical"
            showErrorMessage={false}
          >
            <option value="">{I18n.t('COMMON.ANY')}</option>
            {Object.keys(gameCategories).map(item => (
              <option key={item} value={item}>
                {gameCategories[item]}
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
          name="betTypes"
          label={I18n.t(filterFormAttributeLabels.betTypes)}
          labelClassName="form-label"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(moneyTypeLabels).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, moneyTypeLabels)}
            </option>
          ))}
        </Field>
      </div>
      <div className="col-md-2">
        <Field
          name="winTypes"
          label={I18n.t(filterFormAttributeLabels.winTypes)}
          labelClassName="form-label"
          component={SelectField}
          position="vertical"
          showErrorMessage={false}
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(moneyTypeLabels).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, moneyTypeLabels)}
            </option>
          ))}
        </Field>
      </div>
      <div className="col-md-6">
        <div className="form-group">
          <label className="form-label">
            {I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.FILTER_FORM.ACTIVITY_DATE_RANGE')}
          </label>
          <div className="row">
            <div className="col-md-5">
              <Field
                name="startDate"
                placeholder={I18n.t(filterFormAttributeLabels.startDate)}
                component={DateTimeField}
                position="vertical"
                isValidDate={this.startDateValidator}
              />
            </div>
            <div className="col-md-5">
              <Field
                name="endDate"
                placeholder={I18n.t(filterFormAttributeLabels.endDate)}
                component={DateTimeField}
                position="vertical"
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
                  type="reset"
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={reset}
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FilterForm)
);
