import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, Field } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField } from '../../../../../../../../../../components/ReduxForm';
import { FORM_NAME } from '../../../Form';

import { Currency } from '../../../../../../../../../../components/Amount';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import {
  attributeLabels,
  attributePlaceholders,
} from './constants';

import { moneyTypeUsage, moneyTypeUsageLabels } from '../../../../../../../../../../constants/bonus-campaigns';

class FreeSpin extends Component {
  static propTypes = {
    nodePath: PropTypes.string.isRequired,
    change: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    fetchFreeSpinTemplate: PropTypes.func.isRequired,
    games: PropTypes.array,
    disabled: PropTypes.bool,
    currency: PropTypes.string.isRequired,
    providers: PropTypes.array,
    templates: PropTypes.array,
    currentValues: PropTypes.shape({
      aggregatorId: PropTypes.string,
      betPerLine: PropTypes.number,
      bonusLifeTime: PropTypes.number,
      freeSpinsAmount: PropTypes.number,
      gameId: PropTypes.string,
      moneyTypePriority: PropTypes.string,
      capping: PropTypes.number,
      linesPerSpin: PropTypes.number,
      claimable: PropTypes.bool,
      multiplier: PropTypes.number,
      name: PropTypes.string,
      prize: PropTypes.number,
      providerId: PropTypes.string,
      templateStatus: PropTypes.string,
      templateUUID: PropTypes.string,
    }),
  };

  static defaultProps = {
    disabled: false,
    games: [],
    providers: [],
    templates: [],
    currentValues: {},
  };

  state = {
    currentLines: [],
    currentGames: [],
    customTemplate: false,
  };

  async componentDidMount() {
    const { fetchGames, currentValues: { templateUUID }, fetchFreeSpinTemplates } = this.props;

    const action = await fetchGames();
    await fetchFreeSpinTemplates();
    if (action && !action.error && templateUUID) {
      this.loadTemplateData(templateUUID);
    }
  }

  setField = (field, value = '') => this.props.change(this.buildFieldName(field), value);

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  handleChangeProvider = (providerId) => {
    this.setField('providerId', providerId);
    this.setField('gameId', null);

    this.setState({
      currentLines: [],
      currentGames: this.props.games.filter(i => i.gameProviderId === providerId),
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
        prize,
        capping,
        multiplier,
        moneyTypePriority,
        bonusLifeTime,
        claimable,
        status,
        betPerLine,
        linesPerSpin,
      } = action.payload;

      this.handleChangeProvider(providerId);
      this.handleChangeGame(gameId);

      this.setField('name', name);
      this.setField('freeSpinsAmount', freeSpinsAmount);
      this.setField('prize', prize);
      this.setField('capping', capping);
      this.setField('multiplier', multiplier);
      this.setField('moneyTypePriority', moneyTypePriority);
      this.setField('bonusLifeTime', bonusLifeTime);
      this.setField('claimable', claimable);
      this.setField('templateStatus', status);
      this.setField('betPerLine', betPerLine);
      this.setField('linesPerSpin', linesPerSpin);

      change('rewards.bonus.bonusLifetime', bonusLifeTime);
      change('rewards.bonus.claimable', claimable);
      change('rewards.bonus.wagerWinMultiplier', multiplier);
    }
  };

  handleChangeTemplate = (e) => {
    const templateUUID = e.target.value;
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
      this.setField('templateStatus');
    }

    this.setState({
      customTemplate: value,
    });
  };

  renderAdditionalFields = () => {
    const { currentValues, currency } = this.props;
    const { customTemplate } = this.state;

    if (!currentValues.aggregatorId) {
      return null;
    }

    return (
      <div className="col-md-4">
        <Field
          name={this.buildFieldName('betPerLine')}
          type="number"
          label={I18n.t(attributeLabels.betPerLine)}
          labelClassName="form-label"
          position="vertical"
          component={InputField}
          normalize={v => parseFloat(v)}
          placeholder={'0.00'}
          showErrorMessage
          disabled={
            !currentValues ||
            !currentValues.providerId ||
            !currentValues.gameId ||
            !customTemplate
          }
          inputAddon={<Currency code={currency} />}
        />
      </div>
    );
  };

  render() {
    const {
      disabled,
      remove,
      providers,
      currentValues,
      currency,
      templates,
    } = this.props;

    const {
      currentLines,
      currentGames,
      customTemplate,
    } = this.state;

    return (
      <div className="add-campaign-container">
        <div className="add-campaign-label">
          {I18n.t(attributeLabels.freeSpinReward)}
        </div>

        <div className="filter-row">
          <div className="filter-row__big">
            <div className="range-group">
              <div className="form-group first-deposit">
                <label>
                  <input
                    type="checkbox"
                    onChange={this.toggleCustomTemplate}
                    checked={customTemplate}
                  /> Custom Template
                </label>
              </div>
              <div className="form-group">
                <Field
                  name={this.buildFieldName('templateUUID')}
                  label={I18n.t(attributeLabels.template)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  onChange={this.handleChangeTemplate}
                  disabled={customTemplate}
                >
                  <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CHOOSE_TEMPLATE')}</option>
                  {templates.map(item => (
                    <option key={item.uuid} value={item.uuid}>
                      {item.name}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-row__big">
            <Field
              name={this.buildFieldName('name')}
              type="text"
              placeholder=""
              label={I18n.t(attributeLabels.name)}
              component={InputField}
              position="vertical"
              disabled={!customTemplate}
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-row__medium">
            <Field
              name={this.buildFieldName('providerId')}
              label={I18n.t(attributeLabels.providerId)}
              labelClassName="form-label"
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

          <div className="filter-row__medium">
            <Field
              name={this.buildFieldName('gameId')}
              label={I18n.t(attributeLabels.gameId)}
              labelClassName="form-label"
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
        </div>

        <hr />

        <div className="row">
          <div className="col-md-3">
            <Field
              name={this.buildFieldName('freeSpinsAmount')}
              type="number"
              aplaceholder="0"
              label={I18n.t(attributeLabels.freeSpins)}
              component={InputField}
              normalize={v => parseFloat(v)}
              position="vertical"
              disabled={!customTemplate}
            />
          </div>
          <div className="col-md-3">
            <Field
              name={this.buildFieldName('prize')}
              label={I18n.t(attributeLabels.prize)}
              labelClassName="form-label"
              type="number"
              disabled={disabled || !customTemplate}
              component={InputField}
              normalize={v => parseFloat(v)}
              position="vertical"
              placeholder={'0.00'}
              inputAddon={<Currency code={currency} />}
              showErrorMessage={false}
            />
          </div>
          <div className="col-md-3">
            <Field
              name={this.buildFieldName('capping')}
              label={I18n.t(attributeLabels.capping)}
              labelClassName="form-label"
              type="number"
              disabled={disabled || !customTemplate}
              component={InputField}
              normalize={v => parseFloat(v)}
              position="vertical"
              placeholder={'0.00'}
              inputAddon={<Currency code={currency} />}
              showErrorMessage={false}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <Field
              name={this.buildFieldName('linesPerSpin')}
              type="number"
              label="lines per spin"
              labelClassName="form-label"
              position="vertical"
              component={SelectField}
              normalize={v => parseFloat(v)}
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
          {this.renderAdditionalFields()}
        </div>

        <hr />
        <div className="form-row">
          <div className="form-row__small">
            <Field
              name={this.buildFieldName('multiplier')}
              type="number"
              placeholder="0.00"
              label={I18n.t(attributeLabels.wagering)}
              component={InputField}
              normalize={v => parseFloat(v)}
              position="vertical"
              disabled={disabled || !customTemplate}
            />
          </div>
          <div className="form-row__medium">
            <Field
              name={this.buildFieldName('moneyTypePriority')}
              type="text"
              label={I18n.t(attributeLabels.moneyPriority)}
              component={SelectField}
              position="vertical"
              disabled={disabled || !customTemplate}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypeUsage).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="form-row__small form-row_with-placeholder-right">
            <Field
              name={this.buildFieldName('bonusLifeTime')}
              type="number"
              placeholder="0"
              label={I18n.t(attributeLabels.lifeTime)}
              component={InputField}
              normalize={v => parseFloat(v)}
              position="vertical"
              disabled={disabled || !customTemplate}
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-row__big">
            <div className="form-group">
              <Field
                name={this.buildFieldName('claimable')}
                type="checkbox"
                component="input"
                disabled={disabled || !customTemplate}
              /> Claimable
            </div>
          </div>
        </div>

        {
          !disabled &&
          <button
            type="button"
            onClick={remove}
            className="btn-transparent add-campaign-remove"
          >
            &times;
          </button>
        }
      </div>
    );
  }
}

export default connect((state) => {
  const currentValues = getFormValues(FORM_NAME)(state);

  return {
    currentValues: _.get(currentValues, 'rewards.freeSpin') || {},
  };
})(FreeSpin);
