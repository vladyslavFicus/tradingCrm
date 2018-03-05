import React, { Component } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import { statuses as freeSpinTemplate } from '../../../../../../../constants/free-spin-template';
import { InputField, SelectField, NasSelectField } from '../../../../../../../components/ReduxForm';
import Amount, { Currency } from '../../../../../../../components/Amount';
import { attributeLabels } from './constants';
import { customValueFieldTypes } from '../../../../../../../constants/form';
import floatNormalize from '../../../../../../../utils/floatNormalize';
import Bonus from './Bonus';

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
    freeSpinTemplates: PropTypes.arrayOf(PropTypes.freeSpinListEntity),
    fetchBonusTemplate: PropTypes.func.isRequired,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
    typeValues: PropTypes.arrayOf(PropTypes.string),
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    disabled: false,
    games: [],
    providers: [],
    freeSpinTemplates: [],
    bonusTemplates: [],
    typeValues: [],
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
    const { fetchGames, fetchFreeSpinTemplates, fetchBonusTemplates } = this.props;

    const { _reduxForm: { values: { rewards } } } = this.context;
    const templateUUID = get(rewards, 'freeSpin.templateUUID');
    const action = await fetchGames();
    await fetchFreeSpinTemplates({ status: freeSpinTemplate.CREATED });
    await fetchBonusTemplates({ status: freeSpinTemplate.CREATED }); // use other const
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
    const { fetchFreeSpinTemplate } = this.props;

    const action = await fetchFreeSpinTemplate(templateUUID);
    if (action && !action.error) {
      const {
        name,
        providerId,
        gameId,
        freeSpinsAmount,
        betPerLineAmounts,
        linesPerSpin,
        bonusTemplateUUID,
      } = action.payload;

      let { betPerLine } = action.payload;

      if (!betPerLine && Array.isArray(betPerLineAmounts) && betPerLineAmounts.length) {
        [{ amount: betPerLine }] = betPerLineAmounts;
      }

      this.handleChangeProvider(providerId);
      this.handleChangeGame(gameId);

      this.setField('name', name);
      this.setField('freeSpinsAmount', freeSpinsAmount);
      this.setField('betPerLine', betPerLine);
      this.setField('linesPerSpin', linesPerSpin);

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
        grantRatio,
        wageringRequirement,
        claimable,
        maxGrantAmount,
      } = action.payload;

      this.setField('bonus.templateUUID', uuid);
      this.setField('bonus.name', name);
      this.setField('bonus.moneyTypePriority', moneyTypePriority);
      this.setField('bonus.lockAmountStrategy', lockAmountStrategy);
      this.setField('bonus.maxBet', get(action.payload, 'maxBet.currencies[0].amount', ''));
      this.setField('bonus.bonusLifeTime', bonusLifeTime);
      this.setField('bonus.grantRatio.type', grantRatio.ratioType);

      if (grantRatio.ratioType === customValueFieldTypes.ABSOLUTE) {
        this.setField('bonus.grantRatio.value', get(action.payload, 'grantRatio.value.currencies[0].amount', ''));
      } else if (grantRatio.ratioType === customValueFieldTypes.PERCENTAGE) {
        this.setField('bonus.grantRatio.value', get(action.payload, 'grantRatio.percentage', ''));
      }

      if (maxGrantAmount) {
        this.setField('bonus.maxGrantAmount', get(action.payload, 'maxGrantAmount.currencies[0].amount', ''));
      }

      this.setField('bonus.wageringRequirement', wageringRequirement);
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

    this.loadTemplateData(templateUUID);
  };

  handleChangeBonusTemplateData = (_, bonusTemplateUUID) => {
    this.setField('bonus.templateUUID', bonusTemplateUUID);

    this.loadBonusTemplateData(bonusTemplateUUID);
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
      freeSpinTemplates,
      bonusTemplates,
      typeValues,
      change,
      nodePath,
      currencies,
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
                labelClassName="form-label"
                component={NasSelectField}
                showErrorMessage={false}
                position="vertical"
                disabled={customTemplate}
                onChange={this.handleChangeTemplate}
              >
                {freeSpinTemplates.map(item => (
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
        {
          (customTemplate || (!customTemplate && get(currentValues, 'bonus.templateUUID', false))) &&
          <div>
            <hr />
            <Bonus
              disabled={disabled || !customTemplate}
              typeValues={typeValues}
              nodePath={`${nodePath}.bonus`}
              change={change}
              bonusTemplates={bonusTemplates}
              handleChangeBonusTemplateData={this.handleChangeBonusTemplateData}
            />
          </div>
        }
      </div>
    );
  }
}

export default FreeSpin;
