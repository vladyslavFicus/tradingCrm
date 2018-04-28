import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get, mapValues } from 'lodash';
import classNames from 'classnames';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { floatNormalize, intNormalize } from '../../../../../utils/inputNormalize';
import normalizeNumber from '../../../../../utils/normalizeNumber';
import { attributeLabels, attributePlaceholders } from '../constants';
import Amount from '../../../../../components/Amount';
import BonusView from '../../Bonus/BonusView';
import { statuses as freeSpinTemplateStatuses } from '../../../../../constants/free-spin-template';
import { freeSpinTemplateQuery } from '../../../../../graphql/queries/campaigns';
import {
  SelectField,
  MultiCurrencyValue,
  InputField,
} from '../../../../../components/ReduxForm';
import './FreeSpinCreateModal.scss';

class FreeSpinCreateModal extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    currentValues: PropTypes.object.isRequired,
    onSave: PropTypes.func,
    gameId: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    aggregatorId: PropTypes.string,
    addFreeSpinTemplate: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    freeSpinOptions: PropTypes.shape({
      freeSpinOptions: PropTypes.object,
    }).isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }).isRequired,
    games: PropTypes.shape({
      games: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
          internalGameId: PropTypes.string,
          fullGameName: PropTypes.string,
          coinSizes: PropTypes.arrayOf(PropTypes.number),
          betLevels: PropTypes.arrayOf(PropTypes.number),
          pageCodes: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
          })),
        })),
      }),
    }),
    isOpen: PropTypes.bool.isRequired,
    bonusTemplateUUID: PropTypes.object,
    notify: PropTypes.func.isRequired,
    client: PropTypes.shape({
      query: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    onSave: null,
    games: {},
    gameId: '',
    bonusTemplateUUID: {},
    aggregatorId: '',
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  componentWillReceiveProps({ isOpen }) {
    if (this.props.isOpen && !isOpen) {
      this.props.reset();

      if (this.pollingFreeSpinTemplate) {
        this.stopPollingFreeSpinTemplate();
      }
    }
  }

  componentWillUnmount() {
    if (this.pollingFreeSpinTemplate) {
      this.stopPollingFreeSpinTemplate();
    }
  }

  getGame(gameId) {
    const { games } = this.props;
    const gameList = get(games, 'games.content', []);

    return gameList.find(i => i.gameId === gameId) || {
      betLevels: [],
      coinSizes: [],
      lines: [],
      pageCodes: [],
    };
  }

  get currency() {
    const {
      optionCurrencies: {
        options,
      },
    } = this.props;

    return {
      currencies: get(options, 'signUp.post.currency.list', []),
      baseCurrency: get(options, 'signUp.post.currency.base', ''),
    };
  }

  get aggregatorOptions() {
    const {
      freeSpinOptions: {
        freeSpinOptions,
      },
    } = this.props;

    return freeSpinOptions || {};
  }

  setField = (field, value = '') => this.context._reduxForm.autofill(field, value);

  handleChangeProvider = () => {
    const fields = get(this.aggregatorOptions, `[${this.props.aggregatorId}].fields`);
    this.setField('gameId', null);

    if (fields.indexOf('betLevel') !== -1) {
      this.setField('betLevel', 1);
    }

    if (fields.indexOf('coinSize') !== -1) {
      this.setField('coinSize', 1);
    }
  };

  handleChangeGame = ({ target: { value } }) => {
    const { clientId, moduleId } = this.getGame(value);
    const fields = get(this.aggregatorOptions, `[${this.props.aggregatorId}].fields`);

    this.setField('clientId', fields.indexOf('clientId') !== -1 ? clientId : null);
    this.setField('moduleId', fields.indexOf('moduleId') !== -1 ? moduleId : null);
  };

  handleChangeBonusUUID = (uuid) => {
    this.setField('bonusTemplateUUID.uuid', uuid);
  };

  stopPollingFreeSpinTemplate = () => {
    clearInterval(this.pollingFreeSpinTemplate);
    this.pollingFreeSpinTemplate = null;
  };

  startPollingFreeSpinTemplate = (aggregatorId, uuid) => new Promise((resolve) => {
    this.pollingFreeSpinTemplate = setInterval(async () => {
      const fs = await this.props.client.query({
        query: freeSpinTemplateQuery,
        variables: { aggregatorId, uuid },
        fetchPolicy: 'network-only',
      });

      const status = get(fs, 'data.freeSpinTemplate.data.status');
      if (status === freeSpinTemplateStatuses.CREATED || status === freeSpinTemplateStatuses.FAILED) {
        this.stopPollingFreeSpinTemplate();
        resolve({ success: status === freeSpinTemplateStatuses.CREATED });
      }
    }, 100);
  });

  handleSubmit = async ({ betPerLine, bonusTemplateUUID: { uuid: bonusTemplateUUID }, ...data }) => {
    const { addFreeSpinTemplate, onSave, onCloseModal, reset, notify, games } = this.props;
    const internalGameId = (
      get(games, 'games.content', [])
        .find(({ gameId }) => gameId === data.gameId) || {}
    ).internalGameId;
    const variables = { ...data, bonusTemplateUUID, internalGameId };
    const response = await addFreeSpinTemplate({ variables });
    const { error, fields_errors } = get(response, 'data.freeSpinTemplate.add.error') || {};

    if (fields_errors) {
      const fieldsErrors = mapValues(fields_errors, 'error');

      throw new SubmissionError({ ...fieldsErrors });
    } else if (error) {
      notify({
        level: 'error',
        title: I18n.t('CAMPAIGNS.FREE_SPIN.CREATE.ERROR_TITLE'),
        message: I18n.t(error),
      });
      throw new SubmissionError({ _error: error });
    }

    const { uuid, status } = get(response, 'data.freeSpinTemplate.add.data');

    if (status === freeSpinTemplateStatuses.FAILED) {
      notify({
        level: 'error',
        title: I18n.t('CAMPAIGNS.FREE_SPIN.CREATE.ERROR_TITLE'),
      });
      throw new SubmissionError();
    } else if (status === freeSpinTemplateStatuses.PENDING) {
      const polling = await this.startPollingFreeSpinTemplate(variables.aggregatorId, uuid);

      if (!polling.success) {
        notify({
          level: 'error',
          title: I18n.t('CAMPAIGNS.FREE_SPIN.CREATE.ERROR_TITLE'),
        });
        throw new SubmissionError({});
      }
    }

    notify({
      level: 'success',
      title: I18n.t('CAMPAIGNS.FREE_SPIN.CREATE.SUCCESS_TITLE'),
    });

    reset();

    if (onSave) {
      onSave(uuid);
    }

    onCloseModal();
  };

  renderPrice = () => {
    const { baseCurrency: currency } = this.currency;
    const { currentValues: { betPerLineAmounts, ...currentValues } } = this.props;
    const betPerLine = get(betPerLineAmounts, '[0].amount', 0);

    const betPrice = betPerLine ? parseFloat(betPerLine) : 0;
    const linesPerSpin = currentValues.linesPerSpin ? parseFloat(currentValues.linesPerSpin) : 0;

    const freeSpinsAmount = currentValues.freeSpinsAmount ? parseInt(currentValues.freeSpinsAmount, 10) : 0;
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
      handleSubmit,
      onCloseModal,
      isOpen,
      bonusTemplateUUID,
      aggregatorId,
      games,
      gameId,
    } = this.props;
    const { aggregatorOptions } = this;
    const { baseCurrency } = this.currency;
    const providers = get(aggregatorOptions, `[${aggregatorId}].providers`, []);
    const fields = get(aggregatorOptions, `[${aggregatorId}].fields`);
    const gameList = get(games, 'games.content', []);
    const { betLevels, coinSizes, lines, pageCodes } = this.getGame(gameId);
    const showPriceWidget = baseCurrency && fields &&
      fields.indexOf('linesPerSpin') !== -1 &&
      fields.indexOf('betPerLineAmounts') !== -1;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('CAMPAIGNS.FREE_SPIN.HEADER')}</ModalHeader>
        <ModalBody tag="form" onSubmit={handleSubmit(this.handleSubmit)} id="free-spin-create-modal-form">
          <Field
            name="name"
            type="text"
            placeholder=""
            id="campaign-freespin-create-modal-name"
            label={I18n.t('CAMPAIGNS.FREE_SPIN.NAME')}
            component={InputField}
            position="vertical"
          />
          <div className="row">
            <Field
              name="aggregatorId"
              disabled={!Object.keys(aggregatorOptions).length}
              label={I18n.t(attributeLabels.aggregatorId)}
              position="vertical"
              component={SelectField}
              showErrorMessage={false}
              className="col-md-4"
              id="campaign-freespin-create-modal-aggregator-id"
            >
              <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_AGGREGATOR')}</option>
              {Object.keys(aggregatorOptions).map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
            <Field
              name="providerId"
              label={I18n.t(attributeLabels.providerId)}
              position="vertical"
              disabled={!providers.length}
              component={SelectField}
              showErrorMessage={false}
              onChange={this.handleChangeProvider}
              className="col-md-4"
              id="campaign-freespin-create-modal-provider-id"
            >
              <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_PROVIDER')}</option>
              {providers.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
            <Field
              name="gameId"
              label={I18n.t(attributeLabels.gameId)}
              disabled={!gameList.length}
              position="vertical"
              onChange={this.handleChangeGame}
              component={SelectField}
              className="col-md-4"
              id="campaign-freespin-create-modal-game-id"
            >
              <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
              {gameList.map(item => (
                <option key={item.internalGameId} value={item.gameId}>
                  {`${item.fullGameName} (${item.gameId})`}
                </option>
              ))}
            </Field>
          </div>
          <If condition={fields}>
            <div className="row">
              <div className={classNames({ 'col-12': !showPriceWidget, 'col-7': showPriceWidget })}>
                <div className="row">
                  <Field
                    name="freeSpinsAmount"
                    type="number"
                    placeholder="0"
                    label={I18n.t(attributeLabels.freeSpins)}
                    component={InputField}
                    normalize={floatNormalize}
                    position="vertical"
                    className="col-md-6"
                    id="campaign-freespin-create-modal-freespins-amount"
                  />
                  <div className="form-row_with-placeholder-right col-md-6">
                    <Field
                      name="freeSpinLifeTime"
                      type="text"
                      placeholder="0"
                      normalize={intNormalize}
                      label={I18n.t(attributeLabels.freeSpinLifeTime)}
                      component={InputField}
                      position="vertical"
                      id="campaign-freespin-create-modal-freespin-lifetime"
                    />
                    <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
                  </div>
                  <If condition={fields.indexOf('betPerLineAmounts') !== -1}>
                    <MultiCurrencyValue
                      baseName="betPerLineAmounts"
                      label={I18n.t(attributeLabels.betPerLine)}
                      className="col-md-6"
                      id="campaign-freespin-create-modal-bet-perline"
                    />
                  </If>
                  <If condition={fields.indexOf('linesPerSpin') !== -1}>
                    <Field
                      name="linesPerSpin"
                      type="number"
                      label={I18n.t(attributeLabels.linesPerSpin)}
                      position="vertical"
                      component={SelectField}
                      normalize={floatNormalize}
                      showErrorMessage={false}
                      disabled={!lines.length}
                      className="col-md-6"
                      id="campaign-freespin-create-modal-lines-per-spin"
                    >
                      <option value="">
                        {I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_LINES_PER_SPIN')}
                      </option>
                      {lines.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Field>
                  </If>
                </div>
              </div>
              <If condition={showPriceWidget}>
                <div className="col-5">
                  {this.renderPrice()}
                </div>
              </If>
              <If condition={fields.indexOf('betLevel') !== -1}>
                <Field
                  name="betLevel"
                  label={I18n.t(attributeLabels.betLevel)}
                  type="select"
                  parse={normalizeNumber}
                  component={SelectField}
                  position="vertical"
                  disabled={betLevels.length <= 1}
                  className="col-md-6"
                  id="campaign-freespin-create-modal-bet-level"
                >
                  {betLevels.map(item => <option key={item} value={item}>{item}</option>)}
                </Field>
              </If>
              <If condition={fields.indexOf('coinSize') !== -1}>
                <Field
                  name="coinSize"
                  label={I18n.t(attributeLabels.coinSize)}
                  type="select"
                  parse={normalizeNumber}
                  component={SelectField}
                  position="vertical"
                  disabled={coinSizes.length <= 1}
                  className="col-md-6"
                  id="campaign-freespin-create-modal-coin-size"
                >
                  {coinSizes.map(item => <option key={item} value={item}>{item}</option>)}
                </Field>
              </If>
              <If condition={fields.indexOf('pageCode') !== -1}>
                <Field
                  name="pageCode"
                  label={I18n.t(attributeLabels.pageCode)}
                  type="select"
                  component={SelectField}
                  position="vertical"
                  disabled={!pageCodes.length}
                  className="col-md-6"
                  id="campaign-freespin-create-modal-page-code"
                >
                  <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_PAGE_CODE')}</option>
                  {pageCodes.map(item => <option key={item.value} value={item.value}>{I18n.t(item.label)}</option>)}
                </Field>
              </If>
              <If condition={fields.indexOf('betMultiplier') !== -1}>
                <Field
                  name="betMultiplier"
                  type="number"
                  step="any"
                  label={I18n.t(attributeLabels.betMultiplier)}
                  position="vertical"
                  component={InputField}
                  normalize={floatNormalize}
                  showErrorMessage={false}
                  className="col-md-6"
                  id="campaign-freespin-create-modal-bet-multiplier"
                />
              </If>
              <If condition={fields.indexOf('rhfpBet') !== -1}>
                <Field
                  name="rhfpBet"
                  type="number"
                  placeholder="0"
                  normalize={intNormalize}
                  label={I18n.t(attributeLabels.rhfpBet)}
                  component={InputField}
                  position="vertical"
                  className="col-md-6"
                  id="campaign-freespin-create-modal-rhfp-bet"
                />
              </If>
              <If condition={fields.indexOf('comment') !== -1}>
                <Field
                  name="comment"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.comment)}
                  component={InputField}
                  position="vertical"
                  className="col-md-6"
                  id="campaign-freespin-create-modal-comment"
                />
              </If>
              <If condition={fields.indexOf('nearestCost') !== -1}>
                <Field
                  name="nearestCost"
                  type="number"
                  step="any"
                  placeholder="0"
                  label={I18n.t(attributeLabels.nearestCost)}
                  position="vertical"
                  component={InputField}
                  normalize={floatNormalize}
                  className="col-md-6"
                  id="campaign-freespin-create-modal-nearestCost"
                />
              </If>
              <If condition={fields.indexOf('displayLine1') !== -1}>
                <Field
                  name="displayLine1"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.displayLine1)}
                  component={InputField}
                  position="vertical"
                  className="col-md-6"
                  id="campaign-freespin-create-modal-displayLine1"
                />
              </If>
              <If condition={fields.indexOf('displayLine2') !== -1}>
                <Field
                  name="displayLine2"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.displayLine2)}
                  component={InputField}
                  position="vertical"
                  className="col-md-6"
                  id="campaign-freespin-create-modal-displayLine2"
                />
              </If>
            </div>
            <If condition={fields.indexOf('bonusTemplateUUID') !== -1} >
              <BonusView
                onChangeUUID={this.handleChangeBonusUUID}
                uuid={bonusTemplateUUID.uuid}
                name="bonusTemplateUUID"
              />
            </If>
          </If>
        </ModalBody>
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-primary"
            form="free-spin-create-modal-form"
          >
            {I18n.t('COMMON.SAVE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FreeSpinCreateModal;
