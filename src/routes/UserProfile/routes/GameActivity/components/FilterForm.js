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

  render() {
    const {
      games,
      gameCategories,
      aggregators,
      gamesList,
      providers,
      submitting,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="keyword"
                type="text"
                label={I18n.t(filterFormAttributeLabels.keyword)}
                placeholder={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.FILTER_FORM.KEYWORD_INPUT_PLACEHOLDER')}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="aggregators"
                label={I18n.t(filterFormAttributeLabels.aggregators)}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any</option>
                {aggregators.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="providers"
                label={I18n.t(filterFormAttributeLabels.providers)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {providers.map(item => (
                  <option key={item} value={item}>
                    {providers}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="games"
                label={I18n.t(filterFormAttributeLabels.games)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {games.map(item => (
                  <option key={item} value={item}>
                    {gamesList[item]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="gameTypes"
                label={I18n.t(filterFormAttributeLabels.gameTypes)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(gameCategories).map(item => (
                  <option key={item} value={item}>
                    {gameCategories[item]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="betTypes"
                label={I18n.t(filterFormAttributeLabels.betTypes)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(moneyTypeLabels).map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, moneyTypeLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="winTypes"
                label={I18n.t(filterFormAttributeLabels.winTypes)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(moneyTypeLabels).map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, moneyTypeLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.FILTER_FORM.ACTIVITY_DATE_RANGE')}</label>
                <div className="range-group">
                  <Field
                    name="startDate"
                    placeholder={I18n.t(filterFormAttributeLabels.startDate)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="endDate"
                    placeholder={I18n.t(filterFormAttributeLabels.endDate)}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    position="vertical"
                    className={null}
                  />
                </div>
              </div>
            </div>
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
                  disabled={submitting}
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FilterForm),
);
