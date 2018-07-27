import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { attributeLabels } from '../constants';
import { NasSelectField } from '../../../../../../components/ReduxForm';
import MultiCurrencyView from '../../../../../../components/MultiCurrencyView';
import Placeholder from '../../../../../../components/Placeholder';
import BonusView from '../../Bonus/BonusView';
import Uuid from '../../../../../../components/Uuid';
import Amount from '../../../../../../components/Amount';
import DeviceTypeField from '../../DeviceTypeField';

class FreeSpinView extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string,
    onChangeUUID: PropTypes.func.isRequired,
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
  };

  static defaultProps = {
    freeSpinTemplate: {
      loading: true,
    },
    optionCurrencies: { options: {}, loading: true },
    uuid: null,
    disabled: false,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
    fields: PropTypes.object,
  };

  get rates() {
    const { optionCurrencies: { options } } = this.props;

    return get(options, 'signUp.post.currency.rates', []);
  }

  handleOpenModal = () => {
    const { modals: { createFreeSpin }, onChangeUUID } = this.props;

    createFreeSpin.show({ onSave: onChangeUUID });
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
      uuid,
      freeSpinTemplates: {
        freeSpinTemplates,
      },
      name,
      freeSpinTemplate: {
        loading,
        freeSpinTemplate,
      },
      disabled,
    } = this.props;

    const fsTemplates = freeSpinTemplates || [];
    const fsTemplate = get(freeSpinTemplate, 'data', {});
    const gameName = get(fsTemplate, 'game.data.fullGameName', '-');

    return (
      <div className="campaigns-template">
        <div className="row campaigns-template__bordered-bottom-block">
          <DeviceTypeField
            name={`${name}.deviceType`}
            disabled={disabled}
            id="campaign-freespin-templates-device-type"
          />
        </div>
        <div className="row">
          <Field
            name={`${name}.uuid`}
            disabled={disabled}
            label={I18n.t(attributeLabels.template)}
            component={NasSelectField}
            showErrorMessage={false}
            id="campaign-freespin-templates-select"
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
                id="campaign-freespin-templates-add-btn"
              >
                {I18n.t(attributeLabels.addFreeSpin)}
              </button>
            </div>
          </If>
        </div>
        <If condition={uuid}>
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
            <div className="row no-gutters mb-3 campaigns-template__bordered-block" id="campaigns-freespin-template">
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
                      id={`${name}-betPerLineAmounts`}
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
    );
  }
}

export default FreeSpinView;
