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
import Amount, { Currency } from '../../../../../components/Amount';
import BonusView from '../../Bonus/BonusView';
import { statuses as freeSpinTemplateStatuses } from '../../../../../constants/free-spin-template';
import {
  SelectField,
  InputField,
} from '../../../../../components/ReduxForm';
import './FreeSpinCreateModal.scss';

class FreeSpinCreateModal extends Component {
  static propTypes = {
    destroy: PropTypes.func.isRequired,
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
      this.props.destroy();
    }
  }

  get gameData() {
    const { gameId, games } = this.props;
    const gameList = get(games, 'games.content', []);

    return gameList.find(i => i.internalGameId === gameId) || {
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

  handleChangeBonusUUID = (uuid) => {
    this.setField('bonusTemplateUUID.uuid', uuid);
  }

  handleSubmit = async ({ betPerLine, currency, bonusTemplateUUID: { uuid: bonusTemplateUUID }, ...data }) => {
    const { addFreeSpinTemplate, onSave, onCloseModal, destroy, notify } = this.props;
    const variables = { ...data, bonusTemplateUUID };

    if (betPerLine) {
      variables.betPerLineAmounts = [
        {
          currency,
          amount: betPerLine,
        },
      ];
    }

    const response = await addFreeSpinTemplate({ variables });
    const { error, fields_errors } = get(response, 'data.freeSpinTemplate.add.error') || {};

    if (fields_errors) {
      const fieldsErrors = mapValues(fields_errors, 'error');

      throw new SubmissionError({ ...fieldsErrors });
    } else if (error) {
      notify({
        level: 'error',
        title: I18n.t('CAMPAIGN.FREE_SPIN.CREATE.ERROR_TITLE'),
        message: I18n.t(error),
      });
      throw new SubmissionError({ _error: error });
    }

    const { uuid, status } = get(response, 'data.freeSpinTemplate.add.data');

    if (status === freeSpinTemplateStatuses.FAILED) {
      notify({
        level: 'error',
        title: I18n.t('CAMPAIGN.FREE_SPIN.CREATE.ERROR_TITLE'),
        message: I18n.t('CAMPAIGN.FREE_SPIN.CREATE.FAILED'),
      });
      throw new SubmissionError({ _error: 'CAMPAIGN.FREE_SPIN.CREATE.FAILED' });
    }

    if (onSave) {
      onSave(uuid);
    }

    notify({
      level: 'success',
      title: I18n.t('CAMPAIGN.FREE_SPIN.CREATE.SUCCESS_TITLE'),
      message: I18n.t('CAMPAIGN.FREE_SPIN.CREATE.SUCCESS_MESSAGE'),
    });

    onCloseModal();
    destroy();
  };

  renderPrice = () => {
    const { baseCurrency: currency } = this;
    const { currentValues: { betPerLine, linesPerSpin, freeSpinsAmount } } = this.props;
    const betPrice = betPerLine
      ? parseFloat(betPerLine) : 0;
    const linesPS = linesPerSpin
      ? parseFloat(linesPerSpin) : 0;

    const FSAmount = freeSpinsAmount
      ? parseInt(freeSpinsAmount, 10) : 0;
    const spinValue = { amount: 0, currency };
    const totalValue = { amount: 0, currency };

    if (!isNaN(betPrice) && !isNaN(linesPS)) {
      spinValue.amount = betPrice * linesPS;
    }
    if (!isNaN(betPrice) && !isNaN(linesPS) && !isNaN(FSAmount)) {
      totalValue.amount = betPrice * linesPS * FSAmount;
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
    } = this.props;
    const { currencies, baseCurrency } = this.currency;
    const { aggregatorOptions } = this;
    const providers = get(aggregatorOptions, `[${aggregatorId}].providers`, []);
    const fields = get(aggregatorOptions, `[${aggregatorId}].fields`);
    const gameList = get(games, 'games.content', []);
    const { gameData: { betLevels, coinSizes, lines, pageCodes } } = this;
    const showPriceWidget = fields &&
      fields.indexOf('linesPerSpin') !== -1 &&
      fields.indexOf('betPerLineAmounts') !== -1;

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('CAMPAIGNS.FREE_SPIN.HEADER')}</ModalHeader>
        <form id="fs-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="currency"
                  label={I18n.t('COMMON.CURRENCY')}
                  type="select"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_CURRENCY')}</option>
                  {currencies.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <Field
              name={'name'}
              type="text"
              id={'freeSpinName'}
              placeholder=""
              label={'Name'}
              component={InputField}
              position="vertical"
            />
            <div className="row">
              <div className="col-4">
                <Field
                  name="aggregatorId"
                  id="aggregatorId"
                  label={I18n.t(attributeLabels.aggregatorId)}
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                >
                  <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_AGGREGATOR')}</option>
                  {Object.keys(aggregatorOptions).map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-4">
                <Field
                  name="providerId"
                  id="providerId"
                  label={I18n.t(attributeLabels.providerId)}
                  position="vertical"
                  disabled={!providers.length}
                  component={SelectField}
                  showErrorMessage={false}
                  onChange={this.handleChangeProvider}
                >
                  <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_PROVIDER')}</option>
                  {providers.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-4">
                <Field
                  name="gameId"
                  label={I18n.t(attributeLabels.gameId)}
                  id="gameId"
                  disabled={!gameList.length}
                  position="vertical"
                  component={SelectField}
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_GAME')}</option>
                  {gameList.map(item => (
                    <option key={item.internalGameId} value={item.internalGameId}>
                      {`${item.fullGameName} (${item.gameId})`}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <If condition={fields}>
              <div className="row">
                <div className={classNames({ 'col-12': !showPriceWidget, 'col-7': showPriceWidget })}>
                  <div className="row">
                    <div className="col-6">
                      <Field
                        name="freeSpinsAmount"
                        type="number"
                        id="freeSpinsAmount"
                        placeholder="0"
                        label={I18n.t(attributeLabels.freeSpins)}
                        component={InputField}
                        normalize={floatNormalize}
                        position="vertical"
                        showErrorMessage={false}
                      />
                    </div>
                    <div className="form-row_with-placeholder-right col-6">
                      <Field
                        name="freeSpinLifeTime"
                        id="freeSpinLifeTime"
                        type="text"
                        placeholder="0"
                        normalize={intNormalize}
                        label={I18n.t(attributeLabels.freeSpinLifeTime)}
                        component={InputField}
                        position="vertical"
                      />
                      <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
                    </div>
                  </div>
                  <div className="row">
                    <If condition={fields.indexOf('betPerLineAmounts') !== -1}>
                      <div className="col-6">
                        <Field
                          name="betPerLine"
                          type="number"
                          id="betPerLine"
                          step="any"
                          label={I18n.t(attributeLabels.betPerLine)}
                          labelClassName="form-label"
                          position="vertical"
                          component={InputField}
                          normalize={floatNormalize}
                          placeholder={'0.00'}
                          showErrorMessage={false}
                          inputAddon={<Currency code={baseCurrency} />}
                        />
                      </div>
                    </If>
                    <If condition={fields.indexOf('linesPerSpin') !== -1}>
                      <div className="col-6">
                        <Field
                          name="linesPerSpin"
                          id="linesPerSpin"
                          type="number"
                          label={I18n.t(attributeLabels.linesPerSpin)}
                          labelClassName="form-label"
                          position="vertical"
                          component={SelectField}
                          normalize={floatNormalize}
                          showErrorMessage={false}
                          disabled={!lines.length}
                        >
                          <option value="">{I18n.t('PLAYER_PROFILE.FREE_SPIN.MODAL_CREATE.CHOOSE_LINES_PER_SPIN')}</option>
                          {lines.map(item => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </If>
                  </div>
                </div>
                <If condition={showPriceWidget}>
                  <div className="col-5">
                    {this.renderPrice()}
                  </div>
                </If>
                <If condition={fields.indexOf('betLevel') !== -1}>
                  <div className="col-6">
                    <Field
                      name="betLevel"
                      id="betLevel"
                      label={I18n.t(attributeLabels.betLevel)}
                      type="select"
                      parse={normalizeNumber}
                      component={SelectField}
                      position="vertical"
                      disabled={betLevels.length <= 1}
                    >
                      {betLevels
                        .map(item => <option key={item} value={item}>{item}</option>)}
                    </Field>
                  </div>
                </If>
                <If condition={fields.indexOf('coinSize') !== -1}>
                  <div className="col-6">
                    <Field
                      name="coinSize"
                      id="coinSize"
                      label={I18n.t(attributeLabels.coinSize)}
                      type="select"
                      parse={normalizeNumber}
                      component={SelectField}
                      position="vertical"
                      disabled={coinSizes.length <= 1}
                    >
                      {coinSizes
                        .map(item => <option key={item} value={item}>{item}</option>)}
                    </Field>
                  </div>
                </If>
                <If condition={fields.indexOf('pageCode') !== -1}>
                  <div className="col-6">
                    <Field
                      name="pageCode"
                      id="pageCode"
                      label={I18n.t(attributeLabels.pageCode)}
                      type="select"
                      component={SelectField}
                      position="vertical"
                      disabled={!pageCodes.length}
                    >
                      <option value="">{I18n.t('CAMPAIGNS.FREE_SPIN.CHOOSE_PAGE_CODE')}</option>
                      {pageCodes.map(item => <option key={item.value} value={item.value}>{I18n.t(item.label)}</option>)}
                    </Field>
                  </div>
                </If>
                <If condition={fields.indexOf('betMultiplier') !== -1}>
                  <div className="col-6">
                    <Field
                      name="betMultiplier"
                      type="number"
                      id="betMultiplier"
                      step="any"
                      label={I18n.t(attributeLabels.betMultiplier)}
                      labelClassName="form-label"
                      position="vertical"
                      component={InputField}
                      normalize={floatNormalize}
                      showErrorMessage={false}
                    />
                  </div>
                </If>
                <If condition={fields.indexOf('rhfpBet') !== -1}>
                  <div className="col-6">
                    <Field
                      name="rhfpBet"
                      type="number"
                      id="rhfpBet"
                      placeholder="0"
                      normalize={intNormalize}
                      label={I18n.t(attributeLabels.rhfpBet)}
                      component={InputField}
                      position="vertical"
                    />
                  </div>
                </If>
                <If condition={fields.indexOf('comment') !== -1}>
                  <div className="col-6">
                    <Field
                      name="comment"
                      type="text"
                      id="comment"
                      placeholder=""
                      label={I18n.t(attributeLabels.comment)}
                      component={InputField}
                      position="vertical"
                    />
                  </div>
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
            <div className="row">
              <div className="col-7">
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                  id="create-new-operator-submit-button"
                  form="fs-form"
                >
                  {I18n.t('COMMON.SAVE')}
                </button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default FreeSpinCreateModal;
