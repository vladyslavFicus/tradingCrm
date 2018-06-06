import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import moment from 'moment';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  NasSelectField, RangeGroup, DateTimeField, InputField,
} from '../../../../../../../../../../../components/ReduxForm';
import MultiCurrencyView from '../../../../../../../../../../../components/MultiCurrencyView';
import Placeholder from '../../../../../../../../../../../components/Placeholder';
import BonusView from '../Bonus/BonusView';
import stopPropagation from '../../../../../../../../../../../utils/stopPropagation';
import Uuid from '../../../../../../../../../../../components/Uuid';
import Amount from '../../../../../../../../../../../components/Amount';
import { intNormalize } from '../../../../../../../../../../../utils/inputNormalize';
import { attributeLabels } from '../constants';

class FreeSpinAssignModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string,
    freeSpinTemplates: PropTypes.shape({
      freeSpinTemplates: PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string,
      })),
    }).isRequired,
    modals: PropTypes.shape({
      createFreeSpin: PropTypes.shape({
        show: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    freeSpinTemplate: PropTypes.shape({
      freeSpinTemplate: PropTypes.shape({
        data: PropTypes.shape({
          uuid: PropTypes.string,
          status: PropTypes.string,
        }),
      }),
    }),
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }),
    disabled: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formValues: PropTypes.shape({
      uuid: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      freeSpinsAmount: PropTypes.number,
    }),
  };

  static defaultProps = {
    freeSpinTemplate: {
      loading: true,
    },
    optionCurrencies: { options: {}, loading: true },
    uuid: null,
    disabled: false,
    formValues: {},
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
    fields: PropTypes.object,
  };

  onChangeUUID = (uuid) => {
    this.context._reduxForm.autofill('uuid', uuid);
  };

  get rates() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  startDateValidator = toAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && formValues[toAttribute]
      ? current.isSameOrBefore(moment(formValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { formValues } = this.props;

    return formValues && formValues[fromAttribute]
      ? current.isSameOrAfter(moment(formValues[fromAttribute]))
      : true;
  };

  handleOpenModal = () => {
    const { modals: { createFreeSpin } } = this.props;

    createFreeSpin.show({ onSave: this.onChangeUUID });
  };

  renderPrice = () => {
    const {
      freeSpinTemplate: {
        freeSpinTemplate,
      },
    } = this.props;

    const { betPerLineAmounts, linesPerSpin, freeSpinsAmount } = get(freeSpinTemplate, 'data', {});
    const betPerLine = get(betPerLineAmounts, '[0].amount', 0);
    const currency = get(betPerLineAmounts, '[0].currency', 0);
    const betPrice = betPerLine ? parseFloat(betPerLine) : 0;
    const linesPS = linesPerSpin ? parseFloat(linesPerSpin) : 0;
    const FSAmount = freeSpinsAmount ? parseInt(freeSpinsAmount, 10) : 0;

    return (
      <div className="col-4 mt-3">
        <div className="row no-gutters">
          <div className="col-6 pr-2">
            <div className="free-spin-card">
              <div className="free-spin-card-values">
                <Amount {...{ amount: betPrice * linesPS, currency }} />
              </div>
              <div className="free-spin-card-values">{currency}</div>
              <div className="free-spin-card-label">{I18n.t(attributeLabels.spinValue)}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="free-spin-card">
              <div className="free-spin-card-values">
                <Amount {...{ amount: betPrice * linesPS * FSAmount, currency }} />
              </div>
              <div className="free-spin-card-values">{currency}</div>
              <div className="free-spin-card-label">{I18n.t(attributeLabels.totalValue)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      freeSpinTemplates: {
        freeSpinTemplates,
      },
      freeSpinTemplate: {
        loading,
        freeSpinTemplate,
      },
      disabled,
      onCloseModal,
      isOpen,
      formValues,
      handleSubmit,
      onSubmit,
    } = this.props;

    const uuid = get(formValues, 'uuid', null);

    const fsTemplates = freeSpinTemplates || [];
    const fsTemplate = get(freeSpinTemplate, 'data', {});
    const gameName = get(fsTemplate, 'game.data.fullGameName', '-');

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('CAMPAIGNS.FREE_SPIN.HEADER')}</ModalHeader>
        <ModalBody
          tag="form"
          onSubmit={e => stopPropagation(e, handleSubmit(onSubmit))}
          id="assign-free-spin-modal-form"
        >
          <div className="campaigns-template">
            <div className="row">
              <Field
                name="uuid"
                disabled={disabled}
                label={I18n.t(attributeLabels.template)}
                component={NasSelectField}
                showErrorMessage={false}
                className="col"
                helpText={
                  <If condition={fsTemplate.uuid}>
                    <Uuid
                      length={16}
                      uuidPartsCount={4}
                      uuid={fsTemplate.uuid}
                      uuidPrefix="FS"
                      className="d-block text-left"
                    />
                  </If>
                }
                id="assign-free-spin-modal-select"
              >
                {fsTemplates.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <If condition={!disabled}>
                <div className="col-auto margin-top-20">
                  <button
                    className="btn btn-primary text-uppercase"
                    type="button"
                    onClick={this.handleOpenModal}
                  >
                    {I18n.t(attributeLabels.addFreeSpin)}
                  </button>
                </div>
              </If>
            </div>
            <If condition={uuid}>
              <div className="row">
                <RangeGroup
                  className="col-md-10"
                  label={I18n.t(attributeLabels.availabilityDateRange)}
                >
                  <Field
                    name="startDate"
                    placeholder={I18n.t(attributeLabels.startDate)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('endDate')}
                    id="assign-free-spin-modal-startdate"
                  />
                  <Field
                    name="endDate"
                    placeholder={I18n.t(attributeLabels.endDate)}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('startDate')}
                    id="assign-free-spin-modal-enddate"
                  />
                </RangeGroup>
                <Field
                  name="freeSpinsAmount"
                  type="number"
                  placeholder="0"
                  label={I18n.t(attributeLabels.freeSpins)}
                  component={InputField}
                  normalize={intNormalize}
                  className="col-md-6"
                  id="assign-free-spin-modal-freespins-amount"
                />
              </div>
              <Placeholder
                ready={!loading}
                className={null}
                customPlaceholder={(
                  <div>
                    <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                    <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                    <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                    <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                    <TextRow className="animated-background" style={{ width: '80%', height: '20px' }} />
                    <TextRow className="animated-background" style={{ width: '80%', height: '12px' }} />
                  </div>
                )}
              >
                <div className="row no-gutters my-3 campaigns-template__bordered-block">
                  <div className="col-4">
                    {I18n.t(attributeLabels.providerId)}
                    <div className="campaigns-template__value">
                      {fsTemplate.providerId}
                    </div>
                  </div>
                  <div className="col-4">
                    {I18n.t(attributeLabels.gameId)}
                    <div className="campaigns-template__value">
                      {gameName}
                    </div>
                    <If condition={fsTemplate.gameId}>
                      <Uuid
                        className="mt-5"
                        length={16}
                        uuidPartsCount={4}
                        uuid={fsTemplate.internalGameId || fsTemplate.gameId}
                      />
                    </If>
                  </div>
                  <div className="col-4">
                    {I18n.t(attributeLabels.status)}
                    <div className="campaigns-template__value">
                      {fsTemplate.status}
                    </div>
                  </div>
                </div>
                <div className="row no-gutters">
                  <div className="col-4">
                    {I18n.t(attributeLabels.freeSpins)}
                    <div className="campaigns-template__value">
                      {fsTemplate.freeSpinsAmount}
                    </div>
                  </div>
                  <div className="col-4">
                    {I18n.t(attributeLabels.lifeTime)}
                    <div className="campaigns-template__value">
                      {fsTemplate.freeSpinLifeTime}
                    </div>
                  </div>
                  <If condition={fsTemplate.linesPerSpin && fsTemplate.betPerLineAmounts}>
                    {this.renderPrice()}
                  </If>
                </div>
                <div className="row no-gutters">
                  <If condition={fsTemplate.linesPerSpin}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.linesPerSpin)}
                      <div className="campaigns-template__value">
                        {fsTemplate.linesPerSpin}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.betPerLineAmounts}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.betPerLine)}
                      <div className="campaigns-template__value">
                        <MultiCurrencyView
                          id="betPerLineAmounts"
                          values={fsTemplate.betPerLineAmounts}
                          rates={this.rates}
                        />
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.coinSize}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.coinSize)}
                      <div className="campaigns-template__value">
                        {fsTemplate.coinSize}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.betLevel}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.betLevel)}
                      <div className="campaigns-template__value">
                        {fsTemplate.betLevel}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.pageCode}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.pageCode)}
                      <div className="campaigns-template__value">
                        {fsTemplate.pageCode}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.denomination}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.denomination)}
                      <div className="campaigns-template__value">
                        {fsTemplate.denomination}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.coins}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.coins)}
                      <div className="campaigns-template__value">
                        {fsTemplate.coins}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.betMultiplier}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.betMultiplier)}
                      <div className="campaigns-template__value">
                        {fsTemplate.betMultiplier}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.rhfpBet}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.rhfpBet)}
                      <div className="campaigns-template__value">
                        {fsTemplate.rhfpBet}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.comment}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.comment)}
                      <div className="campaigns-template__value">
                        {fsTemplate.comment}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.nearestCost}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.nearestCost)}
                      <div className="campaigns-template__value">
                        {fsTemplate.nearestCost}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.displayLine1}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.displayLine1)}
                      <div className="campaigns-template__value">
                        {fsTemplate.displayLine1}
                      </div>
                    </div>
                  </If>
                  <If condition={fsTemplate.displayLine2}>
                    <div className="col-4 mt-3">
                      {I18n.t(attributeLabels.displayLine2)}
                      <div className="campaigns-template__value">
                        {fsTemplate.displayLine2}
                      </div>
                    </div>
                  </If>
                  <div className="col-4">
                    {I18n.t(attributeLabels.claimable)}
                    <div className="campaigns-template__value">
                      <Choose>
                        <When condition={fsTemplate.claimable}>
                          {I18n.t('COMMON.YES')}
                        </When>
                        <Otherwise>
                          {I18n.t('COMMON.NO')}
                        </Otherwise>
                      </Choose>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <If condition={fsTemplate.bonusTemplateUUID}>
                    <BonusView uuid={fsTemplate.bonusTemplateUUID} isViewMode />
                  </If>
                </div>
              </Placeholder>
            </If>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-primary"
            form="assign-free-spin-modal-form"
            id="assign-free-spin-modal-save"
          >
            {I18n.t('COMMON.SAVE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default FreeSpinAssignModal;
