import React, { Component } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import {
  InputField, SelectField, CustomValueFieldVertical, NasSelectField,
} from '../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders } from '../Bonus/constants';
import { customValueFieldTypes } from '../../../../../../../constants/form';
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
    change: PropTypes.func.isRequired,
    handleChangeBonusTemplateData: PropTypes.func.isRequired,
    customTemplate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    onToggleCustomTemplate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    limits: true,
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
    autofill(this.buildFieldName('capping.type'), customValueFieldTypes.ABSOLUTE);
    autofill(this.buildFieldName('prize.type'), customValueFieldTypes.ABSOLUTE);
  }

  setField = (field, value = '') => this.props.change(this.buildFieldName(field), value);

  buildFieldName = name => `${this.props.nodePath}.${name}`;

  handleToggleCustomTemplate = () => {
    const { customTemplate, onToggleCustomTemplate } = this.props;
    const { _reduxForm: { values: { rewards } } } = this.context;
    const currentValues = get(rewards, 'freeSpin.bonus', {});

    if (!customTemplate) {
      this.setField('templateUUID');
    }

    onToggleCustomTemplate(currentValues.templateUUID);
  };

  render() {
    const {
      disabled,
      remove,
      nodePath,
      bonusTemplates,
      handleChangeBonusTemplateData,
      customTemplate,
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
            <div className="col-8">
              <Field
                name={this.buildFieldName('templateUUID')}
                id={`${form}TemplateUUID`}
                label={I18n.t(attributeLabels.template)}
                component={NasSelectField}
                showErrorMessage={false}
                position="vertical"
                disabled={customTemplate}
                onChange={handleChangeBonusTemplateData}
              >
                {bonusTemplates.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <If condition={currentUuid}>
                <div className="form-group__note mb-2">
                  <Uuid
                    uuid={currentUuid}
                    uuidPartsCount={3}
                    length={18}
                  />
                </div>
              </If>
            </div>
            <div className="col-4 margin-top-40">
              <label>
                <input
                  type="checkbox"
                  id={`${form}BonusCustomTemplate`}
                  onChange={this.handleToggleCustomTemplate}
                  checked={!!customTemplate}
                /> Custom Template
              </label>
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
            <CustomValueFieldVertical
              disabled={disabled || !customTemplate}
              id={`${form}BonusGrantRatio`}
              basename={this.buildFieldName('grantRatio')}
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

        <CustomValueFieldVertical
          disabled={disabled || !customTemplate}
          id={`${form}BonusWageringRequirement`}
          basename={this.buildFieldName('wageringRequirement')}
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
        </CustomValueFieldVertical>

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
          <div className="col-6 form-row_with-placeholder-right">
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
            />
            <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <CustomValueFieldVertical
              disabled={disabled || !customTemplate}
              id={`${form}Capping`}
              basename={this.buildFieldName('capping')}
              label={I18n.t(attributeLabels.capping)}
              valueFieldProps={{
                type: 'number',
                normalize: floatNormalize,
              }}
            />
          </div>
          <div className="col-6">
            <CustomValueFieldVertical
              disabled={disabled || !customTemplate}
              id={`${form}Prize`}
              basename={this.buildFieldName('prize')}
              label={I18n.t(attributeLabels.prize)}
              valueFieldProps={{
                type: 'number',
                normalize: floatNormalize,
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <Field
            name={this.buildFieldName('claimable')}
            type="checkbox"
            component="input"
            disabled={disabled || !customTemplate}
          /> {I18n.t('COMMON.CLAIMABLE')}
        </div>
      </div>
    );
  }
}

export default Bonus;
