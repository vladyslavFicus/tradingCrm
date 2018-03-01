import React, { Component } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import { statuses as freeSpinTemplate } from '../../../../../../../constants/free-spin-template';
import { InputField, SelectField, NasSelectField } from '../../../../../../../components/ReduxForm';
import Amount, { Currency } from '../../../../../../../components/Amount';
import renderLabel from '../../../../../../../utils/renderLabel';
import {
  attributeLabels,
  attributePlaceholders,
} from './constants';
import { moneyTypeUsage, moneyTypeUsageLabels } from '../../../../../../../constants/bonus-campaigns';
import floatNormalize from '../../../../../../../utils/floatNormalize';

class FreeSpin extends Component {
  static propTypes = {
    nodePath: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    games: PropTypes.array,
    disabled: PropTypes.bool,
    baseCurrency: PropTypes.string.isRequired,
    providers: PropTypes.array,
    templates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
  };

  static defaultProps = {
    disabled: false,
    games: [],
    providers: [],
    templates: [],
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  state = {
    currentLines: [],
    currentGames: [],
    customTemplate: false,
  };

  async componentDidMount() {
    const { fetchGames, fetchFreeSpinTemplates } = this.props;
    const { _reduxForm: { values: { rewards } } } = this.context;
    const templateUUID = get(rewards, 'freeSpin.templateUUID');
    const action = await fetchGames();
    await fetchFreeSpinTemplates({ status: freeSpinTemplate.CREATED });
    if (action && !action.error && templateUUID) {
      this.loadTemplateData(templateUUID);
    }
  }

  setField = (field, value = '') => this.props.change(this.buildFieldName(field), value);

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  handleChangeProvider = (providerId) => {
    this.setField('providerId', providerId);
    this.setField('gameId', null);

    const currentGames = this.props.games.filter(i => i.gameProviderId === providerId);
    console.info(`Selected provider: ${providerId}`);
    console.info(`Games count: ${currentGames.length}`);

    this.setState({
      currentLines: [],
      currentGames,
    });
  };

  loadTemplateData = async (templateUUID) => {
    const { fetchFreeSpinTemplate, change } = this.props;

    const action = await fetchFreeSpinTemplate(templateUUID);
    if (action && !action.error) {
      const {
        name,
        providerId,
        gameId,
        freeSpinsAmount,
        multiplier,
        moneyTypePriority,
        bonusLifeTime,
        claimable,
        betPerLineAmounts,
        linesPerSpin,
      } = action.payload;

      let { betPerLine } = action.payload;

      if (!betPerLine && Array.isArray(betPerLineAmounts) && betPerLineAmounts.length) {
        [{ amount: betPerLine }] = betPerLineAmounts;
      }

      this.handleChangeProvider(providerId);
      this.handleChangeGame(gameId);

      this.setField('name', name);
      this.setField('freeSpinsAmount', freeSpinsAmount);
      this.setField('multiplier', multiplier);
      this.setField('moneyTypePriority', moneyTypePriority);
      this.setField('bonusLifeTime', bonusLifeTime);
      this.setField('claimable', claimable);
      this.setField('betPerLine', betPerLine);
      this.setField('linesPerSpin', linesPerSpin);

      change('rewards.bonus.bonusLifeTime', bonusLifeTime);
      change('rewards.bonus.claimable', claimable);
      change('rewards.bonus.wagerWinMultiplier', multiplier);
    }
  };

  handleChangeTemplate = (_, templateUUID) => {
    this.setField('templateUUID', templateUUID);

    this.loadTemplateData(templateUUID);
  };

  handleChangeGame = (gameId) => {
    const game = this.state.currentGames.find(i => i.gameId === gameId);

    if (game) {
      this.setField('aggregatorId', game.aggregatorId);
      this.setField('gameId', game.gameId);

      this.setState({
        currentLines: game.lines,
      });
    }
  };

  toggleCustomTemplate = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (value) {
      this.setField('templateUUID');
    }

    this.setState({
      customTemplate: value,
    });
  };

  renderAdditionalFields = () => {
    const { baseCurrency, disabled } = this.props;
    const { _reduxForm: { form, values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});
    const { customTemplate } = this.state;

    if (!currentValues.aggregatorId) {
      return null;
    }

    return (
      <Field
        name={this.buildFieldName('betPerLine')}
        type="number"
        id={`${form}BetPerLine`}
        step="any"
        label={I18n.t(attributeLabels.betPerLine)}
        labelClassName="form-label"
        position="vertical"
        component={InputField}
        normalize={floatNormalize}
        placeholder={'0.00'}
        showErrorMessage={false}
        disabled={
          disabled ||
          !currentValues ||
          !currentValues.providerId ||
          !currentValues.gameId ||
          !customTemplate
        }
        inputAddon={<Currency code={baseCurrency} />}
      />
    );
  };

  renderPrice = () => {
    const { baseCurrency: currency } = this.props;
    const { _reduxForm: { values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});
    const betPrice = currentValues && currentValues.betPerLine
      ? parseFloat(currentValues.betPerLine) : 0;
    const linesPerSpin = currentValues && currentValues.linesPerSpin
      ? parseFloat(currentValues.linesPerSpin) : 0;

    const freeSpinsAmount = currentValues && currentValues.freeSpinsAmount
      ? parseInt(currentValues.freeSpinsAmount, 10) : 0;
    const spinValue = { amount: 0, currency };
    const totalValue = { amount: 0, currency };

    if (!isNaN(betPrice) && !isNaN(linesPerSpin)) {
      spinValue.amount = betPrice * linesPerSpin;
    }
    if (!isNaN(betPrice) && !isNaN(linesPerSpin) && !isNaN(freeSpinsAmount)) {
      totalValue.amount = betPrice * linesPerSpin * freeSpinsAmount;
    }

    return (
      <div className="row no-gutters h-100">
        <div className="col-6 pr-2">
          <div className="free-spin-card">
            <div className="free-spin-card-values"><Amount {...spinValue} /></div>
            <div className="free-spin-card-values">{spinValue.currency}</div>
            <div className="free-spin-card-label">{I18n.t(attributeLabels.spinValue)}</div>
          </div>
        </div>
        <div className="col-6">
          <div className="free-spin-card">
            <div className="free-spin-card-values"><Amount {...totalValue} /></div>
            <div className="free-spin-card-values">{totalValue.currency}</div>
            <div className="free-spin-card-label">{I18n.t(attributeLabels.totalValue)}</div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      disabled,
      remove,
      providers,
      templates,
    } = this.props;

    const { _reduxForm: { form, values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});
    const {
      currentLines,
      currentGames,
      customTemplate,
    } = this.state;

    return (
      <div className="container-fluid add-campaign-container">
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {I18n.t(attributeLabels.freeSpinReward)}
          </div>
          {
            !disabled &&
            <div className="col-auto text-right">
              <button
                type="button"
                onClick={remove}
                className="btn-transparent add-campaign-remove"
              >
                &times;
              </button>
            </div>
          }
        </div>
        <If condition={!disabled}>
          <div className="row">
            <div className="col-8">
              <Field
                name={this.buildFieldName('templateUUID')}
                id={`${form}TemplateUUID`}
                label={I18n.t(attributeLabels.template)}
                labelClassName="form-label"
                component={NasSelectField}
                showErrorMessage={false}
                position="vertical"
                disabled={customTemplate}
                onChange={this.handleChangeTemplate}
              >
                {templates.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </Field>
            </div>
            <div className="col-4 align-self-center">
              <label>
                <input
                  type="checkbox"
                  id={`${form}CustomTemplate`}
                  onChange={this.toggleCustomTemplate}
                  checked={customTemplate}
                /> Custom Template
              </label>
            </div>
          </div>
        </If>
        <Field
          name={this.buildFieldName('name')}
          type="text"
          id={`${form}Name`}
          placeholder=""
          showErrorMessage={false}
          label={I18n.t(attributeLabels.name)}
          component={InputField}
          position="vertical"
          disabled={!customTemplate}
        />
        <div className="row">
          <div className="col-6">
            <Field
              name={this.buildFieldName('providerId')}
              id={`${form}ProviderId`}
              label={I18n.t(attributeLabels.providerId)}
              position="vertical"
              component={SelectField}
              showErrorMessage={false}
              onChange={e => this.handleChangeProvider(e.target.value)}
              disabled={!customTemplate}
            >
              <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_PROVIDER')}</option>
              {providers.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
          <If condition={currentGames.length}>
            <div className="col-6">
              <Field
                name={this.buildFieldName('gameId')}
                label={I18n.t(attributeLabels.gameId)}
                id={`${form}GameId`}
                position="vertical"
                component={SelectField}
                showErrorMessage={false}
                disabled={!currentValues || !currentValues.providerId || !customTemplate}
                onChange={e => this.handleChangeGame(e.target.value)}
              >
                <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
                {currentGames.map(item => (
                  <option key={item.gameId} value={item.gameId}>
                    {`${item.fullGameName} (${item.gameId})`}
                  </option>
                ))}
              </Field>
            </div>
          </If>
        </div>
        <hr />
        <div className="row">
          <div className="col-7">
            <Field
              name={this.buildFieldName('freeSpinsAmount')}
              type="number"
              id={`${form}FreeSpinsAmount`}
              aplaceholder="0"
              label={I18n.t(attributeLabels.freeSpins)}
              component={InputField}
              normalize={floatNormalize}
              position="vertical"
              disabled={!customTemplate}
              showErrorMessage={false}
            />
            <div className="row margin-top-15">
              <div className="col-6">
                <Field
                  name={this.buildFieldName('linesPerSpin')}
                  id={`${form}LinesPerSpin`}
                  type="number"
                  label="lines per spin"
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  normalize={floatNormalize}
                  showErrorMessage={false}
                  disabled={
                    disabled ||
                    !customTemplate ||
                    !currentValues ||
                    !currentValues.providerId ||
                    !currentValues.gameId
                  }
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_LINES_PER_SPIN')}</option>
                  {currentLines.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-6">
                {this.renderAdditionalFields()}
              </div>
            </div>
          </div>
          <div className="col-5">
            {this.renderPrice()}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col">
            <Field
              name={this.buildFieldName('multiplier')}
              type="number"
              id={`${form}Multiplier`}
              placeholder="0"
              label={I18n.t(attributeLabels.wagering)}
              component={InputField}
              normalize={floatNormalize}
              position="vertical"
              disabled={disabled || !customTemplate}
              showErrorMessage={false}
            />
          </div>
          <div className="col">
            <Field
              name={this.buildFieldName('moneyTypePriority')}
              type="text"
              id={`${form}MoneyTypePriority`}
              label={I18n.t(attributeLabels.moneyPriority)}
              component={SelectField}
              position="vertical"
              disabled={disabled || !customTemplate}
              showErrorMessage={false}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypeUsage).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="col">
            <Field
              name={this.buildFieldName('maxBet')}
              type="text"
              id={`${form}MaxBet`}
              placeholder="0"
              label={I18n.t(attributeLabels.maxBet)}
              component={InputField}
              position="vertical"
              disabled={disabled || !customTemplate}
              iconRightClassName="nas nas-currencies_icon"
            />
          </div>
          <div className="col form-row_with-placeholder-right">
            <Field
              name={this.buildFieldName('bonusLifeTime')}
              id={`${form}BonusLifeTime`}
              type="number"
              placeholder="0"
              label={I18n.t(attributeLabels.lifeTime)}
              component={InputField}
              normalize={floatNormalize}
              position="vertical"
              disabled={disabled || !customTemplate}
              showErrorMessage={false}
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>
        <div className="form-group">
          <Field
            name={this.buildFieldName('claimable')}
            id={`${form}Claimable`}
            type="checkbox"
            component="input"
            disabled={disabled || !customTemplate}
          /> {I18n.t('COMMON.CLAIMABLE')}
        </div>
      </div>
    );
  }
}

export default FreeSpin;
