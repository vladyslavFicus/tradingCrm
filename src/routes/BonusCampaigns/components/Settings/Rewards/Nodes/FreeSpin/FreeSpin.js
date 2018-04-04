import React, { Component } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { parse } from 'qs';
import PropTypes from '../../../../../../../constants/propTypes';
import { statuses as freeSpinTemplate } from '../../../../../../../constants/free-spin-template';
import { InputField, SelectField, NasSelectField, DateTimeField } from '../../../../../../../components/ReduxForm';
import { attributeLabels, GAME_TYPES } from './constants';
import Amount, { Currency } from '../../../../../../../components/Amount';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import { floatNormalize, intNormalize } from '../../../../../../../utils/inputNormalize';
import normalizeNumber from '../../../../../../../utils/normalizeNumber';
import { attributePlaceholders } from '../Bonus/constants';
import Bonus from './Bonus';
import { aggregators } from '../../../../../../../routes/UserProfile/routes/Rewards/routes/FreeSpins/constants';
import Uuid from '../../../../../../../components/Uuid';

class FreeSpin extends Component {
  static propTypes = {
    nodePath: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    games: PropTypes.array,
    disabled: PropTypes.bool,
    baseCurrency: PropTypes.string.isRequired,
    freeSpinTemplates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
    fetchBonusTemplate: PropTypes.func.isRequired,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
    typeValues: PropTypes.arrayOf(PropTypes.string),
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    customTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleFreeSpinCustomTemplate: PropTypes.func.isRequired,
    bonusCustomTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleBonusCustomTemplate: PropTypes.func.isRequired,
    fetchGameAggregators: PropTypes.func.isRequired,
    aggregators: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  };

  static defaultProps = {
    disabled: false,
    games: [],
    freeSpinTemplates: [],
    bonusTemplates: [],
    typeValues: [],
    aggregators: {},
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  state = {
    currentLines: [],
    currentGames: [],
  };

  async componentDidMount() {
    const {
      fetchGames,
      fetchFreeSpinTemplates,
      fetchBonusTemplates,
      fetchGameAggregators,
    } = this.props;

    const { _reduxForm: { values: { rewards } } } = this.context;
    const templateUUID = get(rewards, 'freeSpin.templateUUID');
    const action = await fetchGames();

    await fetchFreeSpinTemplates({ status: freeSpinTemplate.CREATED }, true);
    await fetchGameAggregators();
    await fetchBonusTemplates({ status: freeSpinTemplate.CREATED }, true);

    if (action && !action.error && templateUUID) {
      this.loadTemplateData(templateUUID);
    }
  }

  get pageCodes() {
    const gameData = this.gameData;
    const pageCodes = [];

    if (gameData) {
      const { pageCode, mobilePageCode } = parse(this.gameData.startGameUrl, { ignoreQueryPrefix: true });

      if (pageCode) {
        pageCodes.push({
          label: 'PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.GAME_TYPES.DESKTOP',
          value: pageCode,
        });
      }

      if (mobilePageCode && pageCode !== mobilePageCode) {
        pageCodes.push({
          label: 'PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.GAME_TYPES.MOBILE',
          value: mobilePageCode,
        });
      }
    }

    return pageCodes;
  }

  get gameData() {
    const { _reduxForm: { values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});

    return this.state.currentGames.find(i => i.gameId === currentValues.gameId);
  }

  setField = (field, value = '') => this.props.change(this.buildFieldName(field), value);

  loadTemplateData = async (templateUUID) => {
    const { fetchFreeSpinTemplate } = this.props;

    const action = await fetchFreeSpinTemplate(templateUUID);
    if (action && !action.error) {
      const {
        name,
        providerId,
        aggregatorId,
        gameId,
        freeSpinsAmount,
        betPerLineAmounts,
        linesPerSpin,
        bonusTemplateUUID,
        coinSize,
        betMultiplier,
        pageCode,
        comment,
        betLevel,
        freeSpinLifeTime,
        rhfpBet,
      } = action.payload;

      let { betPerLine } = action.payload;

      if (!betPerLine && Array.isArray(betPerLineAmounts) && betPerLineAmounts.length) {
        [{ amount: betPerLine }] = betPerLineAmounts;
      }

      this.setField('name', name);

      this.handleChangeAggregator(aggregatorId);
      this.handleChangeProvider(providerId);
      this.handleChangeGame(gameId);

      if (freeSpinLifeTime) {
        this.setField('freeSpinLifeTime', freeSpinLifeTime);
      }

      if (aggregatorId === aggregators.oryx) {
        this.setField('freeSpinsAmount', freeSpinsAmount);
        this.setField('betMultiplier', betMultiplier);
        this.setField('coinSize', coinSize);
        this.setField('rhfpBet', rhfpBet);
      }

      if (aggregatorId === aggregators.netent) {
        this.setField('coinSize', coinSize);
        this.setField('betLevel', betLevel);
        this.setField('comment', comment || '');
        this.setField('freeSpinsAmount', freeSpinsAmount);
      }

      if (aggregatorId === aggregators.softgamings) {
        this.setField('freeSpinsAmount', freeSpinsAmount);
        this.setField('pageCode', pageCode);
        this.setField('betLevel', betLevel);
      } else {
        this.setField('freeSpinsAmount', freeSpinsAmount);
        this.setField('betPerLine', betPerLine);
        this.setField('linesPerSpin', linesPerSpin);
      }

      if (bonusTemplateUUID) {
        this.loadBonusTemplateData(bonusTemplateUUID);
      } else {
        this.resetBonusTemplateData();
      }
    }
  };

  loadBonusTemplateData = async (bonusTemplateUUID) => {
    const action = await this.props.fetchBonusTemplate(bonusTemplateUUID);

    if (action && !action.error) {
      const {
        uuid,
        name,
        moneyTypePriority,
        lockAmountStrategy,
        bonusLifeTime,
        claimable,
        maxGrantAmount,
      } = action.payload;

      this.setField('bonus.templateUUID', uuid);
      this.setField('bonus.name', name);
      this.setField('bonus.moneyTypePriority', moneyTypePriority);
      this.setField('bonus.lockAmountStrategy', lockAmountStrategy);
      this.setField('bonus.maxBet', get(action.payload, 'maxBet.currencies[0].amount', ''));
      this.setField('bonus.bonusLifeTime', bonusLifeTime);

      if (maxGrantAmount) {
        this.setField('bonus.maxGrantAmount', get(action.payload, 'maxGrantAmount.currencies[0].amount', ''));
      }

      ['wageringRequirement', 'grantRatio', 'capping', 'prize'].forEach((key) => {
        const type = `bonus.${key}.type`;
        const value = `bonus.${key}.value`;
        const field = action.payload[key];

        if (field) {
          this.setField(type, field.ratioType);

          const formatValue = field.ratioType === customValueFieldTypes.ABSOLUTE
            ? get(field, 'value.currencies[0].amount', '')
            : get(field, 'percentage', '');

          this.setField(value, formatValue);
        } else {
          this.setField(`bonus.${key}`, '');
        }
      });

      this.setField('bonus.claimable', claimable);
    }
  };

  resetBonusTemplateData = () => {
    [
      'bonus.templateUUID', 'bonus.name', 'bonus.moneyTypePriority',
      'bonus.lockAmountStrategy', 'bonus.maxBet', 'bonus.bonusLifeTime',
      'bonus.grantRatio.type', 'bonus.grantRatio.value', 'bonus.wageringRequirement', 'bonus.claimable',
    ].forEach((field) => {
      this.setField(field, '');
    });
  };

  handleChangeTemplate = (_, templateUUID) => {
    this.setField('templateUUID', templateUUID);

    return this.loadTemplateData(templateUUID);
  };

  handleChangeBonusTemplateData = (_, bonusTemplateUUID) => {
    this.setField('bonus.templateUUID', bonusTemplateUUID);

    return this.loadBonusTemplateData(bonusTemplateUUID);
  };

  handleChangeGame = (gameId) => {
    const game = this.state.currentGames.find(i => i.gameId === gameId);

    if (game) {
      this.setField('gameId', game.gameId);

      if (game.aggregatorId === aggregators.softgamings && game.gameInfoType !== GAME_TYPES.DESKTOP_AND_MOBILE) {
        const { pageCode, mobilePageCode } = parse(game.startGameUrl, { ignoreQueryPrefix: true });

        if (game.gameInfoType === GAME_TYPES.DESKTOP) {
          this.setField('pageCode', pageCode);
        } else {
          this.setField('pageCode', mobilePageCode);
        }
      }

      this.setState({
        currentLines: game.lines,
      });
    }
  };

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  handleChangeProvider = (providerId) => {
    const { _reduxForm: { values: { rewards } } } = this.context;

    this.setField('providerId', providerId);
    this.setField('gameId', null);
    const currentValues = get(rewards, 'freeSpin', {});

    if (currentValues.aggregatorId === aggregators.netent ||
      (currentValues.aggregatorId === aggregators.softgamings && providerId !== 'netent')) {
      this.setField('betLevel', 1);
    }

    if (currentValues.aggregatorId === aggregators.netent || currentValues.aggregatorId === aggregators.oryx) {
      this.setField('coinSize', 1);
    }

    const currentGames = this.props.games.filter(
      i => i.gameProviderId === providerId && i.aggregatorId === currentValues.aggregatorId
    );
    console.info(`Selected provider: ${providerId}`);
    console.info(`Games count: ${currentGames.length}`);

    this.setState({
      currentLines: [],
      currentGames,
    });
  };

  handleChangeAggregator = (aggregatorId) => {
    this.setField('aggregatorId', aggregatorId);

    [
      'providerId', 'gameId', 'betLevel', 'rhfpBet',
      'coinSize', 'betMultiplier', 'freeSpinLifeTime', 'comment',
      'freeSpinsAmount', 'betPerLine', 'linesPerSpin',
    ].forEach(key => this.setField(key));
  };

  renderAdditionalFields = () => {
    const { baseCurrency, disabled, customTemplate } = this.props;
    const { _reduxForm: { form, values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});
    const { currentLines } = this.state;
    const gameData = this.gameData;

    if (!currentValues.aggregatorId) {
      return null;
    }

    const betLevels = get(gameData, 'betLevels', []).length > 1 ? gameData.betLevels : [1];
    const coinSizes = get(gameData, 'coinSizes', []).length > 1 ? gameData.coinSizes : [1];


    if (currentValues.aggregatorId === aggregators.softgamings) {
      return (
        <div>
          <hr />
          <div className="row">
            <div className="col-6">
              <Field
                name={this.buildFieldName('freeSpinsAmount')}
                type="number"
                id={`${form}Count`}
                placeholder="0"
                label={I18n.t(attributeLabels.freeSpinsAmount)}
                component={InputField}
                normalize={intNormalize}
                position="vertical"
                disabled={!customTemplate}
              />
            </div>
            <div className="col-6">
              <Field
                name={this.buildFieldName('pageCode')}
                id={`${form}PageCode`}
                label={I18n.t(attributeLabels.pageCode)}
                component={SelectField}
                position="vertical"
                disabled={!customTemplate || !gameData || gameData.gameInfoType !== GAME_TYPES.DESKTOP_AND_MOBILE}
              >
                <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_PAGE_CODE')}</option>
                {this.pageCodes.map(item => <option key={item.value} value={item.value}>{I18n.t(item.label)}</option>)}
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Field
                name={this.buildFieldName('betLevel')}
                id={`${form}betLevel`}
                label={I18n.t(attributeLabels.betLevel)}
                type="select"
                parse={normalizeNumber}
                component={SelectField}
                position="vertical"
                disabled={!customTemplate || betLevels.length === 1}
              >
                {betLevels
                  .map(item => <option key={item} value={item}>{item}</option>)}
              </Field>
            </div>
          </div>
        </div>
      );
    }

    if (
      currentValues.aggregatorId === aggregators.oryx ||
      currentValues.aggregatorId === aggregators.netent
    ) {
      return (
        <div>
          <hr />
          <div className="row">
            <div className="col-6">
              <Field
                name={this.buildFieldName('freeSpinsAmount')}
                type="number"
                id={`${form}freeSpinsAmount`}
                placeholder="0"
                label={I18n.t(attributeLabels.freeSpins)}
                component={InputField}
                normalize={floatNormalize}
                position="vertical"
                disabled={!customTemplate}
                showErrorMessage={false}
              />
            </div>
            <div className="form-row_with-placeholder-right col-6">
              <Field
                name={this.buildFieldName('freeSpinLifeTime')}
                id={`${form}freeSpinLifeTime`}
                type="text"
                placeholder="0"
                normalize={intNormalize}
                label={I18n.t(attributeLabels.freeSpinLifeTime)}
                component={InputField}
                position="vertical"
                disabled={!customTemplate}
              />
              <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
            </div>
          </div>
          <If condition={currentValues.aggregatorId === aggregators.oryx}>
            <div className="row">
              <div className="col-6">
                <Field
                  name={this.buildFieldName('betMultiplier')}
                  type="number"
                  id={`${form}betMultiplier`}
                  placeholder="0"
                  normalize={intNormalize}
                  label={I18n.t(attributeLabels.betMultiplier)}
                  component={InputField}
                  position="vertical"
                  disabled={!customTemplate}
                />
              </div>
              <div className="col-6">
                <Field
                  name={this.buildFieldName('rhfpBet')}
                  type="number"
                  id={`${form}rhfpBet`}
                  placeholder="0"
                  normalize={intNormalize}
                  label={I18n.t(attributeLabels.rhfpBet)}
                  component={InputField}
                  position="vertical"
                  disabled={!customTemplate}
                />
              </div>
            </div>
          </If>
          <div className="row">
            <div className="col-6">
              <Field
                name={this.buildFieldName('coinSize')}
                id={`${form}coinSize`}
                label={I18n.t(attributeLabels.coinSize)}
                type="select"
                parse={normalizeNumber}
                component={SelectField}
                position="vertical"
                disabled={!customTemplate || coinSizes.length === 1}
              >
                {coinSizes
                  .map(item => <option key={item} value={item}>{item}</option>)}
              </Field>
            </div>
            <If condition={currentValues.aggregatorId === aggregators.netent}>

              <div className="col-6">
                <Field
                  name={this.buildFieldName('betLevel')}
                  id={`${form}betLevel`}
                  label={I18n.t(attributeLabels.betLevel)}
                  type="select"
                  parse={normalizeNumber}
                  component={SelectField}
                  position="vertical"
                  disabled={!customTemplate || betLevels.length === 1}
                >
                  {betLevels
                    .map(item => <option key={item} value={item}>{item}</option>)}
                </Field>
              </div>
              <div className="col-12">
                <Field
                  name={this.buildFieldName('comment')}
                  type="text"
                  id={`${form}Comment`}
                  placeholder=""
                  label={I18n.t(attributeLabels.comment)}
                  component={InputField}
                  position="vertical"
                  disabled={!customTemplate}
                />
              </div>
            </If>
          </div>
        </div>
      );
    }

    return (
      <div>
        <hr />
        <div className="row">
          <div className="col-7">
            <div className="row">
              <div className="col-6">
                <Field
                  name={this.buildFieldName('freeSpinsAmount')}
                  type="number"
                  id={`${form}FreeSpinsAmount`}
                  placeholder="0"
                  label={I18n.t(attributeLabels.freeSpins)}
                  component={InputField}
                  normalize={floatNormalize}
                  position="vertical"
                  disabled={!customTemplate}
                  showErrorMessage={false}
                />
              </div>
              <div className="form-row_with-placeholder-right col-6">
                <Field
                  name={this.buildFieldName('freeSpinLifeTime')}
                  id={`${form}freeSpinLifeTime`}
                  type="text"
                  placeholder="0"
                  normalize={intNormalize}
                  label={I18n.t(attributeLabels.freeSpinLifeTime)}
                  component={InputField}
                  position="vertical"
                  disabled={disabled}
                />
                <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
              </div>
            </div>
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
              </div>
            </div>
          </div>
          <div className="col-5">
            {this.renderPrice()}
          </div>
        </div>
      </div>
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
      freeSpinTemplates,
      bonusTemplates,
      change,
      nodePath,
      currencies,
      customTemplate,
      bonusCustomTemplate,
      onToggleBonusCustomTemplate,
      onToggleFreeSpinCustomTemplate,
      aggregators: aggregatorsMap,
    } = this.props;

    const { _reduxForm: { form, values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin', {});
    const { currentGames } = this.state;

    const availableProviders = get(aggregatorsMap, currentValues.aggregatorId, []);
    const currentUuid = get(currentValues, 'templateUUID', false);

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
        <div className="row">
          <div className="col-md-6">
            <Field
              name="currency"
              label={I18n.t('COMMON.CURRENCY')}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled}
            >
              <option value="">{I18n.t('BONUS_CAMPAIGNS.SETTINGS.CHOOSE_CURRENCY')}</option>
              {currencies.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <If condition={!disabled}>
          <div className="row">
            <div className="col-8">
              <Field
                name={this.buildFieldName('templateUUID')}
                id={`${form}TemplateUUID`}
                label={I18n.t(attributeLabels.template)}
                component={NasSelectField}
                showErrorMessage={false}
                position="vertical"
                disabled={!!customTemplate}
                onChange={this.handleChangeTemplate}
              >
                {freeSpinTemplates.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <If condition={!customTemplate && currentUuid}>
                <div className="form-group__note mb-2">
                  <Uuid
                    uuid={currentUuid}
                    uuidPartsCount={4}
                    length={22}
                  />
                </div>
              </If>
            </div>
            <div className="col-4 margin-top-40">
              <label>
                <input
                  type="checkbox"
                  id={`${form}CustomTemplate`}
                  onChange={onToggleFreeSpinCustomTemplate}
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
          label={I18n.t(attributeLabels.name)}
          component={InputField}
          position="vertical"
          disabled={!customTemplate}
        />
        <div className="row">
          <div className="col-6">
            <Field
              name={this.buildFieldName('aggregatorId')}
              id={`${form}AggregatorId`}
              label={I18n.t(attributeLabels.aggregatorId)}
              position="vertical"
              component={SelectField}
              showErrorMessage={false}
              onChange={e => this.handleChangeAggregator(e.target.value)}
              disabled={!customTemplate}
            >
              <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_AGGREGATOR')}</option>
              {Object.keys(aggregatorsMap).map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
          </div>
          {
            currentValues.aggregatorId &&
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
                {availableProviders.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>
          }
        </div>
        <div className="row">
          <div className="col-6">
            <Field
              name={this.buildFieldName('gameId')}
              label={I18n.t(attributeLabels.gameId)}
              id={`${form}GameId`}
              position="vertical"
              component={SelectField}
              disabled={!currentValues || !currentValues.providerId || !customTemplate}
              onChange={e => this.handleChangeGame(e.target.value)}
            >
              <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
              {currentGames.map(item => (
                <option key={item.internalGameId} value={item.gameId}>
                  {`${item.fullGameName} (${item.gameId})`}
                </option>
              ))}
            </Field>
          </div>
        </div>
        {this.renderAdditionalFields()}
        <If condition={customTemplate || (!customTemplate && get(currentValues, 'bonus.templateUUID', false))}>
          <hr />
          <Bonus
            disabled={disabled || !customTemplate}
            nodePath={`${nodePath}.bonus`}
            change={change}
            bonusTemplates={bonusTemplates}
            handleChangeBonusTemplateData={this.handleChangeBonusTemplateData}
            customTemplate={bonusCustomTemplate}
            onToggleCustomTemplate={onToggleBonusCustomTemplate}
          />
        </If>
      </div>
    );
  }
}

export default FreeSpin;
