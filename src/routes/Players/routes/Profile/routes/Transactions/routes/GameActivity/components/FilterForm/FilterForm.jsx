import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import { moneyTypeLabels } from '../../../../../../../../../../constants/gaming-activity';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../../../../../../../components/ReduxForm';
import filterFormAttributeLabels from '../../constants';
import { startDateValidator, endDateValidator } from '../../../../utils';

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
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="keyword"
          type="text"
          label={I18n.t(filterFormAttributeLabels.keyword)}
          placeholder={I18n.t('PLAYER_PROFILE.GAME_ACTIVITY.FILTER_FORM.KEYWORD_INPUT_PLACEHOLDER')}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="aggregators"
          label={I18n.t(filterFormAttributeLabels.aggregators)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {aggregators.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Field>
        <Field
          name="providers"
          label={I18n.t(filterFormAttributeLabels.providers)}
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
          name="games"
          label={I18n.t(filterFormAttributeLabels.games)}
          component={SelectField}
          className="filter-row__medium"
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
        <Field
          name="betTypes"
          label={I18n.t(filterFormAttributeLabels.betTypes)}
          component={SelectField}
          className="filter-row__small"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(moneyTypeLabels).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, moneyTypeLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="winTypes"
          label={I18n.t(filterFormAttributeLabels.winTypes)}
          component={SelectField}
          className="filter-row__small"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(moneyTypeLabels).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, moneyTypeLabels)}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t(filterFormAttributeLabels.dateRange)}
        >
          <Field
            utc
            withTime
            timePresets
            name="startDate"
            placeholder={I18n.t(filterFormAttributeLabels.startDate)}
            component={DateTimeField}
            isValidDate={startDateValidator(currentValues)}
            showErrorMessage={false}
            pickerClassName="left-side"
          />
          <Field
            utc
            withTime
            timePresets
            name="endDate"
            placeholder={I18n.t(filterFormAttributeLabels.endDate)}
            component={DateTimeField}
            isValidDate={endDateValidator(currentValues)}
            showErrorMessage={false}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
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
      </form>
    );
  }
}

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(reduxForm({
  form: FORM_NAME,
  validate,
})(FilterForm));
