import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import {
  InputField, SelectField, NasSelectField, CustomValueFieldVertical,
} from '../../../../../../../../components/ReduxForm';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import { customValueFieldTypes, customValueFieldTypesLabels } from '../../../../../../../../constants/form';
import { attributeLabels, wageringRequirementCustomValueFieldTypesLabels } from './constants';
import { floatNormalize } from '../../../../../../../../utils/inputNormalize';
import {
  lockAmountStrategy,
  lockAmountStrategyLabels,
  moneyTypeUsage,
} from '../../../../../../../../constants/bonus-campaigns';
import { Currency } from '../../../../../../../../components/Amount';
import findCurrencyAmount from '../../utils/findCurrencyAmount';
import Uuid from '../../../../../../../../components/Uuid';

class CreateModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    change: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    templates: PropTypes.array,
    currency: PropTypes.string.isRequired,
    formValues: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    formName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    templates: [],
    formValues: {},
  };

  state = {
    customTemplate: true,
  };

  componentDidMount() {
    this.props.fetchBonusTemplates({ currency: this.props.currency });
  }

  handleChangeTemplate = (_, value) => {
    this.props.change('templateUUID', value);

    return this.loadTemplateData(value);
  };

  loadTemplateData = async (templateUUID) => {
    const { fetchBonusTemplate, change, currency } = this.props;
    const action = await fetchBonusTemplate(templateUUID);

    if (action && !action.error) {
      const {
        name,
        grantRatio,
        moneyTypePriority,
        lockAmountStrategyValue,
        maxBet,
        bonusLifeTime,
        claimable,
      } = action.payload;

      change('name', name);
      const grantAmount = findCurrencyAmount(get(grantRatio, 'value.currencies'), currency);
      const maxBetAmount = findCurrencyAmount(get(maxBet, 'currencies'), currency);

      if (grantAmount) {
        change('grantRatio', grantAmount);
      }

      if (maxBetAmount) {
        change('maxBet', maxBetAmount);
      }

      ['capping', 'prize'].forEach((key) => {
        const field = action.payload[key];

        if (field) {
          change('prizeCapingType', field.ratioType);

          const formatValue = field.ratioType === customValueFieldTypes.ABSOLUTE
            ? findCurrencyAmount(get(field, 'value.currencies'), currency)
            : get(field, 'percentage', '');

          change(key, formatValue);
        }
      });

      const wageringRequirement = action.payload.wageringRequirement;

      if (wageringRequirement) {
        change('wageringRequirement.type', wageringRequirement.ratioType);

        const formatValue = wageringRequirement.ratioType === customValueFieldTypes.ABSOLUTE
          ? findCurrencyAmount(get(wageringRequirement, 'value.currencies'), currency)
          : get(wageringRequirement, 'percentage', '');

        change('wageringRequirement.value', formatValue);
      }

      change('moneyTypePriority', moneyTypePriority);
      change('lockAmountStrategy', lockAmountStrategyValue);
      change('bonusLifeTime', bonusLifeTime);
      change('claimable', claimable);
    }
  };

  toggleCustomTemplate = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (value) {
      this.props.change('templateUUID', '');
    }

    this.setState({ customTemplate: value });
  };

  handleSubmit = (data) => {
    const { currency, onSubmit } = this.props;
    const formData = { ...data };

    if (this.state.customTemplate) {
      delete formData.templateUUID;
    }

    if (data.maxBet) {
      formData.maxBet = {
        currencies: [{
          amount: data.maxBet,
          currency,
        }],
      };
    }


    if (data.grantRatio) {
      formData.grantRatio = {
        value: {
          currencies: [{
            amount: data.grantRatio,
            currency,
          }],
        },
        ratioType: customValueFieldTypes.ABSOLUTE,
      };
    }

    if (data.wageringRequirement && data.wageringRequirement.type) {
      const amount = formData.wageringRequirement.value;
      const value = formData.wageringRequirement.type === customValueFieldTypes.ABSOLUTE ? {
        value: {
          currencies: [{
            amount,
            currency,
          }],
        },
      } : {
        percentage: amount,
      };

      formData.wageringRequirement = {
        ratioType: formData.wageringRequirement.type,
        ...value,
      };
    }

    ['capping', 'prize'].forEach((key) => {
      if (data[key]) {
        const value = formData.prizeCapingType === customValueFieldTypes.ABSOLUTE ? {
          value: {
            currencies: [{
              amount: formData[key],
              currency,
            }],
          },
        } : {
          percentage: formData[key],
        };

        formData[key] = {
          ratioType: formData.prizeCapingType,
          ...value,
        };
      } else {
        delete formData[key];
      }
    });

    return onSubmit(this.state.customTemplate, formData);
  };

  renderCappingPrizeLabel = label => (
    <span>
      {I18n.t(label)}{' '}
      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
    </span>
  );

  render() {
    const {
      handleSubmit,
      onCloseModal,
      pristine,
      submitting,
      templates,
      currency,
      formValues,
      isOpen,
      formName,
    } = this.props;

    const { customTemplate } = this.state;

    const currentUuid = get(formValues, 'templateUUID', false);

    return (
      <Modal isOpen={isOpen} className="create-bonus-modal" toggle={onCloseModal}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.TITLE')}
        </ModalHeader>
        <ModalBody tag="form" onSubmit={handleSubmit(this.handleSubmit)} id="create-manual-modal">
          <div className="row">
            <div className="col-6">
              <Field
                name="templateUUID"
                label={I18n.t(attributeLabels.template)}
                labelClassName="form-label"
                position="vertical"
                component={NasSelectField}
                showErrorMessage={false}
                onChange={this.handleChangeTemplate}
                disabled={customTemplate}
                placeholder={I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CHOOSE_TEMPLATE')}
              >
                {templates.map(item => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <If condition={!customTemplate && currentUuid}>
                <div className="form-group__note mb-2">
                  <Uuid
                    uuid={currentUuid}
                    uuidPartsCount={3}
                    length={18}
                  />
                </div>
              </If>
            </div>
            <div className="col-6 margin-top-40">
              <label>
                <input
                  type="checkbox"
                  onChange={this.toggleCustomTemplate}
                  checked={customTemplate}
                  id={`${formName}-custom-template`}
                /> {I18n.t(attributeLabels.customTemplate)}
              </label>
            </div>
          </div>

          <Field
            name="name"
            type="text"
            placeholder=""
            label={I18n.t(attributeLabels.name)}
            component={InputField}
            position="vertical"
            disabled={!customTemplate}
            id={`${formName}-name`}
          />

          <div className="row">
            <div className="col-6">
              <Field
                name="grantRatio"
                placeholder="0"
                label={I18n.t(attributeLabels.grantedAmount)}
                component={InputField}
                inputAddon={<Currency code={currency} />}
                inputAddonPosition="left"
                position="vertical"
                type="number"
                normalize={floatNormalize}
                id={`${formName}-granted-amount`}
              />
            </div>
            <div className="col-6">
              <Field
                disabled={!customTemplate}
                id={`${formName}-amount-to-wage`}
                name="wageringRequirement"
                label={I18n.t(attributeLabels.wageringRequirement)}
                valueFieldProps={{
                  type: 'number',
                  normalize: floatNormalize,
                }}
                component={CustomValueFieldVertical}
              >
                {Object.keys(wageringRequirementCustomValueFieldTypesLabels).map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, wageringRequirementCustomValueFieldTypesLabels)}
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
                id={`${formName}-prize`}
                name="prize"
                disabled={!customTemplate}
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
                id={`${formName}-capping`}
                name="capping"
                disabled={!customTemplate}
                placeholder="0"
                component={InputField}
                label={this.renderCappingPrizeLabel(attributeLabels.capping)}
                type="number"
                position="vertical"
                normalize={floatNormalize}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <Field
                name="moneyTypePriority"
                type="text"
                label="Money type priority"
                component={SelectField}
                position="vertical"
                disabled={!customTemplate}
                id={`${formName}-money-type-priority`}
              >
                {Object.keys(moneyTypeUsage).map(key => (
                  <option key={key} value={key}>
                    {renderLabel(key, moneyTypeUsageLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="col-6">
              <Field
                name="lockAmountStrategy"
                label={I18n.t(attributeLabels.lockAmountStrategy)}
                type="select"
                component={SelectField}
                position="vertical"
                disabled={!customTemplate}
                id={`${formName}-lock-strategy`}
              >
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
                name="maxBet"
                placeholder="0"
                label={I18n.t(attributeLabels.maxBet)}
                component={InputField}
                inputAddon={<Currency code={currency} />}
                inputAddonPosition="left"
                position="vertical"
                type="number"
                normalize={floatNormalize}
                disabled={!customTemplate}
                id={`${formName}-max-bet`}
              />
            </div>
            <div className="col-6">
              <Field
                name="bonusLifeTime"
                type="number"
                placeholder="0"
                normalize={floatNormalize}
                label={I18n.t(attributeLabels.lifeTime)}
                component={InputField}
                position="vertical"
                disabled={!customTemplate}
                id={`${formName}-bonus-life-time`}
              />
            </div>
          </div>

          <label>
            <Field
              name="claimable"
              type="checkbox"
              component="input"
              disabled={!customTemplate}
            /> {I18n.t('COMMON.CLAIMABLE')}
          </label>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-default-outline mr-auto"
            disabled={submitting}
            type="reset"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={pristine || submitting}
            id={`${formName}-save-button`}
            form="create-manual-modal"
          >
            {I18n.t('COMMON.SAVE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreateModal;
