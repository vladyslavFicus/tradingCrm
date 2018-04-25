import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, CustomValueFieldVertical,
} from '../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from './constants';
import { moneyTypeUsage, moneyTypeUsageLabels } from '../../../../../../../constants/bonus-campaigns';
import { customValueFieldTypes, customValueFieldTypesLabels } from '../../../../../../../constants/form';
import { floatNormalize } from '../../../../../../../utils/inputNormalize';

class Bonus extends Component {
  static propTypes = {
    typeValues: PropTypes.array.isRequired,
    nodePath: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    remove: PropTypes.func.isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    disabled: false,
    limits: true,
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  componentDidMount() {
    const { _reduxForm: { autofill } } = this.context;
    const { typeValues } = this.props;

    autofill(this.buildFieldName('claimable'), false);
    autofill(this.buildFieldName('campaignRatio.type'), typeValues[0]);
  }

  componentWillReceiveProps({ typeValues: nextTypeValues }) {
    const { _reduxForm: { autofill } } = this.context;
    const { typeValues } = this.props;

    if (typeValues.length !== nextTypeValues.length) {
      autofill(this.buildFieldName('campaignRatio.type'), nextTypeValues[0]);
    }
  }

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  renderCappingPrizeLabel = label => (
    <span>
      {I18n.t(label)}{' '}
      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
    </span>
  );

  render() {
    const {
      typeValues,
      disabled,
      remove,
      currencies,
    } = this.props;
    const { _reduxForm: { form } } = this.context;

    const { _reduxForm: { values: { rewards } } } = this.context;
    const campaignRatioType = get(rewards, 'bonus.campaignRatio.type');

    return (
      <div className="container-fluid add-campaign-container">
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {I18n.t(attributeLabels.bonusReward)}
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
        <div className="row">
          <div className="col-md-4">
            <Field
              name="prizeCapingType"
              label={I18n.t(attributeLabels.prizeCapingType)}
              type="select"
              component={SelectField}
              position="vertical"
            >
              {typeValues.map(key =>
                (
                  <option key={key} value={key}>
                    {renderLabel(key, customValueFieldTypesLabels)}
                  </option>
                )
              )}
            </Field>
          </div>
          <div className="col-md-4">
            <Field
              id={`${form}ConversionPrize`}
              name="conversionPrize"
              disabled={disabled}
              placeholder="0"
              component={InputField}
              label={this.renderCappingPrizeLabel(attributeLabels.prize)}
              type="number"
              position="vertical"
              normalize={floatNormalize}
            />
          </div>
          <div className="col-md-4">
            <Field
              id={`${form}Capping`}
              name="capping"
              disabled={disabled}
              placeholder="0"
              component={InputField}
              label={this.renderCappingPrizeLabel(attributeLabels.capping)}
              type="number"
              position="vertical"
              normalize={floatNormalize}
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-7">
            <Field
              disabled={disabled}
              id={`${form}CampaignRatio`}
              name={this.buildFieldName('campaignRatio')}
              label={I18n.t(attributeLabels.grant)}
              typeValues={typeValues}
              component={CustomValueFieldVertical}
            />
          </div>
          {
            campaignRatioType === customValueFieldTypes.PERCENTAGE &&
            <div className="col-5">
              <Field
                name={this.buildFieldName('maxGrantedAmount')}
                type="text"
                placeholder="0"
                label={I18n.t(attributeLabels.maxGrantedAmount)}
                component={InputField}
                position="vertical"
                disabled={disabled}
                iconRightClassName="nas nas-currencies_icon"
              />
            </div>
          }
        </div>
        <div className="row">
          <div className="col-4">
            <Field
              name={this.buildFieldName('wagerWinMultiplier')}
              type="text"
              id={`${form}WagerWinMultiplier`}
              placeholder="0.00"
              label={I18n.t(attributeLabels.multiplier)}
              component={InputField}
              position="vertical"
              disabled={disabled}
            />
          </div>
          <div className="col-5">
            <Field
              name={this.buildFieldName('moneyTypePriority')}
              type="text"
              id={`${form}MoneyTypePriority`}
              label={I18n.t(attributeLabels.moneyPrior)}
              component={SelectField}
              position="vertical"
              disabled={disabled}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypeUsage).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <Field
              name={this.buildFieldName('maxBet')}
              type="text"
              placeholder="0"
              label={I18n.t(attributeLabels.maxBet)}
              component={InputField}
              position="vertical"
              disabled={disabled}
              iconRightClassName="nas nas-currencies_icon"
            />
          </div>
          <div className="col-4 form-row_with-placeholder-right">
            <Field
              name={this.buildFieldName('bonusLifeTime')}
              id={`${form}bonusLifeTime`}
              type="text"
              placeholder="0"
              label={I18n.t(attributeLabels.lifeTime)}
              component={InputField}
              position="vertical"
              disabled={disabled}
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>
        <div className="form-group">
          <Field
            name={this.buildFieldName('claimable')}
            type="checkbox"
            component="input"
            disabled={disabled}
          /> {I18n.t('COMMON.CLAIMABLE')}
        </div>
      </div>
    );
  }
}

export default Bonus;
