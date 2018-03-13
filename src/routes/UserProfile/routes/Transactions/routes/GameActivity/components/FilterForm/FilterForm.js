import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../utils/renderLabel';
import PropTypes from '../../../../../../../../constants/propTypes';
import { moneyTypeLabels } from '../../../../../../../../constants/gaming-activity';
import { InputField, SelectField, DateTimeField } from '../../../../../../../../components/ReduxForm';
import filterFormAttributeLabels from '../../constants';
import { startDateValidator, endDateValidator } from './utils';
import './FilterForm.scss';

const FORM_NAME = 'userGameActivityFilter';
const validate = (values) => {
  const rules = {
    keyword: 'string',
    aggregators: ['string'],
    providers: ['string'],
    games: ['string'],
    gameTypes: ['string'],
    betTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
    winTypes: ['string', `in:${Object.keys(moneyTypeLabels).join()}`],
    startDate: ['regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/'],
    endDate: ['regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/'],
  };

  const errors = createValidator(rules, filterFormAttributeLabels, false)(values);

  if (values.startDate && !startDateValidator(values)(moment(values.startDate))) {
    errors.startDate = I18n.t('ERRORS.DATE.INVALID_DATE', {
      attributeName: I18n.t(filterFormAttributeLabels.startDate),
    });
  }
  if (values.endDate && !endDateValidator(values)(moment(values.endDate))) {
    errors.endDate = I18n.t('ERRORS.DATE.INVALID_DATE', {
      attributeName: I18n.t(filterFormAttributeLabels.endDate),
    });
  }

  return errors;
};

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func,
    reset: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    aggregators: PropTypes.array.isRequired,
    providers: PropTypes.array.isRequired,
    games: PropTypes.array.isRequired,
    gamesList: PropTypes.arrayOf(PropTypes.shape({
      gameId: PropTypes.string.isRequired,
      internalGameId: PropTypes.string.isRequired,
      fullGameName: PropTypes.string.isRequired,
    })).isRequired,
    currentValues: PropTypes.object,
  };
  static defaultProps = {
    handleSubmit: null,
    reset: null,
    currentValues: {},
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const {
      games,
      aggregators,
      gamesList,
      providers,
      submitting,
      handleSubmit,
      onSubmit,
      currentValues,
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
                    {item}
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
                {games.map((item) => {
                  const game = gamesList
                    .find(i => i.internalGameId === item || i.gameId === item);

                  return (
                    <option key={item} value={item}>
                      {game ? game.fullGameName : item}
                    </option>
                  );
                })}
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
                    utc
                    withTime
                    timePresets
                    name="startDate"
                    placeholder={I18n.t(filterFormAttributeLabels.startDate)}
                    component={DateTimeField}
                    isValidDate={startDateValidator(currentValues)}
                    position="vertical"
                    showErrorMessage={false}
                    pickerClassName="left-side"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    withTime
                    timePresets
                    name="endDate"
                    placeholder={I18n.t(filterFormAttributeLabels.endDate)}
                    component={DateTimeField}
                    isValidDate={endDateValidator(currentValues)}
                    position="vertical"
                    showErrorMessage={false}
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
