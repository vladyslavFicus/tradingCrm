import React, { Component } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import {
  InputField, SelectField, CustomValueFieldVertical, NasSelectField, CheckBox,
} from '../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from '../Bonus/constants';
import { customValueFieldTypes, customValueFieldTypesLabels } from '../../../../../../../constants/form';
import { floatNormalize } from '../../../../../../../utils/inputNormalize';
import {
  lockAmountStrategy,
  lockAmountStrategyLabels,
  moneyTypeUsage,
  moneyTypeUsageLabels,
} from '../../../../../../../constants/bonus-campaigns';
import { wageringRequirementTypes } from './constants';
import Uuid from '../../../../../../../components/Uuid';

class Bonus extends Component {
  static propTypes = {
    nodePath: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    remove: PropTypes.func,
    bonusTemplates: PropTypes.arrayOf(PropTypes.bonusTemplateListEntity),
    handleChangeBonusTemplateData: PropTypes.func.isRequired,
    customTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleCustomTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    remove: null,
    bonusTemplates: [],
  };

  static contextTypes = {
    _reduxForm: PropTypes.object,
  };

  componentDidMount() {
    const { _reduxForm: { autofill } } = this.context;

    autofill(this.buildFieldName('grantRatio.type'), customValueFieldTypes.ABSOLUTE);
    autofill(this.buildFieldName('wageringRequirement.type'), customValueFieldTypes.ABSOLUTE);
    autofill(this.buildFieldName('prizeCapingType'), customValueFieldTypes.ABSOLUTE);
  }

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  renderCappingPrizeLabel = label => (
    <div>
      {I18n.t(label)}{' '}
      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
    </div>
  );

  render() {
    const {
      disabled,
      remove,
      nodePath,
      bonusTemplates,
      handleChangeBonusTemplateData,
      customTemplate,
      onToggleCustomTemplate,
    } = this.props;

    const { _reduxForm: { form, values } } = this.context;

    const grantRatioType = get(values, `${nodePath}.grantRatio.type`);
    const currentUuid = get(values, 'rewards.freeSpin.bonus.templateUUID', false);

    return (
      <div>
        <div className="row align-items-center">
          <div className="col text-truncate add-campaign-label">
            {I18n.t(attributeLabels.bonusReward)}
          </div>
          {
            !disabled && remove &&
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
            <Field
              name={this.buildFieldName('templateUUID')}
              id={`${form}TemplateUUID`}
              label={I18n.t(attributeLabels.template)}
              component={NasSelectField}
              showErrorMessage={false}
              position="vertical"
              disabled={customTemplate}
              onChange={handleChangeBonusTemplateData}
              className="col"
              helpText={
                <If condition={currentUuid}>
                  <Uuid
                    uuid={currentUuid}
                    uuidPartsCount={3}
                    length={18}
                  />
                </If>
              }
            >
              {bonusTemplates.map(item => (
                <option key={item.uuid} value={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Field>
            <div className="col-auto margin-top-40">
              <Field
                name="bonus-campaigns-rewards-freespin-bonus-toggle"
                type="checkbox"
                component={CheckBox}
                id={`${form}BonusCustomTemplate`}
                onChange={onToggleCustomTemplate}
                checked={!!customTemplate}
                label="Custom Template"
              />
            </div>
          </div>
        </If>

        <div className="row">
          <div className="col-md-8">
            <Field
              name={this.buildFieldName('name')}
              type="text"
              id={`${form}BonusName`}
              placeholder=""
              label={I18n.t(attributeLabels.name)}
              component={InputField}
              position="vertical"
              disabled={!customTemplate}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-7">
            <Field
              component={CustomValueFieldVertical}
              disabled={disabled || !customTemplate}
              id={`${form}BonusGrantRatio`}
              name={this.buildFieldName('grantRatio')}
              label={I18n.t(attributeLabels.grant)}
              valueFieldProps={{
                type: 'number',
                normalize: floatNormalize,
              }}
            />
          </div>
          {
            grantRatioType === customValueFieldTypes.PERCENTAGE &&
            <div className="col-5">
              <Field
                name={this.buildFieldName('maxGrantAmount')}
                type="number"
                normalize={floatNormalize}
                placeholder="0"
                label={I18n.t(attributeLabels.maxGrantAmount)}
                component={InputField}
                position="vertical"
                disabled={disabled || !customTemplate}
              />
            </div>
          }
        </div>
        <Field
          disabled={disabled || !customTemplate}
          id={`${form}BonusWageringRequirement`}
          component={CustomValueFieldVertical}
          name={this.buildFieldName('wageringRequirement')}
          label={I18n.t(attributeLabels.wageringRequirement)}
          valueFieldProps={{
            type: 'number',
            normalize: floatNormalize,
          }}
        >
          {
            Object.keys(wageringRequirementTypes).map(key =>
              <option key={key} value={key}>{key}</option>
            )
          }
        </Field>
        <div className="row">
          <div className="col-6">
            <Field
              name={this.buildFieldName('moneyTypePriority')}
              type="text"
              id={`${form}BonusMoneyTypePriority`}
              label={I18n.t(attributeLabels.moneyPrior)}
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
          <div className="col-6">
            <Field
              name={this.buildFieldName('lockAmountStrategy')}
              id={`${form}BonusLockAmountStrategy`}
              label={I18n.t(attributeLabels.lockAmountStrategy)}
              type="select"
              component={SelectField}
              position="vertical"
              disabled={disabled || !customTemplate}
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(lockAmountStrategy).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, lockAmountStrategyLabels)}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <Field
              name={this.buildFieldName('maxBet')}
              id={`${form}BonusMaxBet`}
              placeholder="0"
              label={I18n.t(attributeLabels.maxBet)}
              component={InputField}
              position="vertical"
              disabled={disabled || !customTemplate}
              type="number"
              normalize={floatNormalize}
            />
          </div>
          <Field
            name={this.buildFieldName('bonusLifeTime')}
            id={`${form}BonusLifeTime`}
            type="number"
            placeholder="0"
            normalize={floatNormalize}
            label={I18n.t(attributeLabels.lifeTime)}
            component={InputField}
            position="vertical"
            disabled={disabled || !customTemplate}
            className="col-6"
            inputAddon={I18n.t(attributePlaceholders.days)}
            inputAddonPosition="right"
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <Field
              name={this.buildFieldName('prizeCapingType')}
              label={I18n.t(attributeLabels.prizeCapingType)}
              type="select"
              component={SelectField}
              position="vertical"
            >
              {Object.keys(customValueFieldTypes).map(key =>
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
              id={`${form}Capping`}
              name={this.buildFieldName('capping')}
              disabled={disabled || !customTemplate}
              placeholder="0"
              component={InputField}
              label={this.renderCappingPrizeLabel(attributeLabels.capping)}
              type="number"
              position="vertical"
              normalize={floatNormalize}
            />
          </div>
          <div className="col-md-4">
            <Field
              id={`${form}Prize`}
              name={this.buildFieldName('prize')}
              disabled={disabled || !customTemplate}
              placeholder="0"
              component={InputField}
              label={this.renderCappingPrizeLabel(attributeLabels.prize)}
              type="number"
              position="vertical"
              normalize={floatNormalize}
            />
          </div>
        </div>
        <Field
          name={this.buildFieldName('claimable')}
          type="checkbox"
          component={CheckBox}
          id="bonus-campaigns-rewards-freespin-bonus-claimable"
          disabled={disabled || !customTemplate}
          label={I18n.t('COMMON.CLAIMABLE')}
        />
      </div>
    );
  }
}

export default Bonus;
