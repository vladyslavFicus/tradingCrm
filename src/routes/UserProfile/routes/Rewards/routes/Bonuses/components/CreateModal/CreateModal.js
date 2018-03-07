import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField, NasSelectField } from '../../../../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import { customValueFieldTypes } from '../../../../../../../../constants/form';
import { attributeLabels } from './constants';
import floatNormalize from '../../../../../../../../utils/floatNormalize';
import {
  lockAmountStrategy,
  lockAmountStrategyLabels,
  moneyTypeUsage,
} from '../../../../../../../../constants/bonus-campaigns';
import { Currency } from '../../../../../../../../components/Amount';
import findCurrencyAmount from '../../utils/findCurrencyAmount';

const FORM_NAME = 'manual-bonus-modal';

class CreateModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    change: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchBonusTemplates: PropTypes.func.isRequired,
    fetchBonusTemplate: PropTypes.func.isRequired,
    templates: PropTypes.array,
    currency: PropTypes.string.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    templates: [],
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
        wageringRequirement,
        moneyTypePriority,
        lockAmountStrategyValue,
        maxBet,
        bonusLifeTime,
        claimable,
      } = action.payload;

      change('name', name);
      const grantAmount = findCurrencyAmount(get(grantRatio, 'value.currencies'), currency);
      const maxBetAmount = findCurrencyAmount(get(maxBet, 'currencies'));

      if (grantAmount) {
        change('grantRatio', grantAmount);
      }

      if (maxBetAmount) {
        change('maxBet', maxBetAmount);
      }

      if (wageringRequirement && wageringRequirement.ratioType === customValueFieldTypes.ABSOLUTE) {
        const wageringRequirementAmount = findCurrencyAmount(get(wageringRequirement, 'value.currencies'), currency);

        if (wageringRequirementAmount) {
          change('wageringRequirement', wageringRequirementAmount);
        }
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

    ['wageringRequirement', 'grantRatio', 'capping', 'prize'].forEach((key) => {
      if (data[key]) {
        formData[key] = {
          value: {
            currencies: [{
              amount: data[key],
              currency,
            }],
          },
          ratioType: customValueFieldTypes.ABSOLUTE,
        };
      }
    });

    return onSubmit(this.state.customTemplate, formData);
  };

  render() {
    const {
      handleSubmit,
      onClose,
      pristine,
      submitting,
      invalid,
      templates,
      currency,
    } = this.props;

    const { customTemplate } = this.state;

    return (
      <Modal className="create-bonus-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
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
              </div>
              <div className="col-4 align-self-center">
                <label>
                  <input
                    type="checkbox"
                    onChange={this.toggleCustomTemplate}
                    checked={customTemplate}
                    id={`${FORM_NAME}-custom-template`}
                  /> {I18n.t(attributeLabels.customTemplate)}
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <Field
                  name="name"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.name)}
                  component={InputField}
                  position="vertical"
                  disabled={!customTemplate}
                  id={`${FORM_NAME}-name`}
                />
              </div>
            </div>

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
                  disabled={!customTemplate}
                  id={`${FORM_NAME}-granted-amount`}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <Field
                  name="wageringRequirement"
                  placeholder="0"
                  label={I18n.t(attributeLabels.wageringRequirement)}
                  component={InputField}
                  inputAddon={<Currency code={currency} />}
                  inputAddonPosition="left"
                  position="vertical"
                  type="number"
                  normalize={floatNormalize}
                  disabled={!customTemplate}
                  id={`${FORM_NAME}-amount-to-wage`}
                />
              </div>
              <div className="col-4">
                <Field
                  name="capping"
                  label={I18n.t(attributeLabels.capping)}
                  type="text"
                  disabled={!customTemplate}
                  component={InputField}
                  inputAddon={<Currency code={currency} />}
                  inputAddonPosition="left"
                  position="vertical"
                  id={`${FORM_NAME}-capping`}
                />
              </div>
              <div className="col-4">
                <Field
                  name="prize"
                  label={I18n.t(attributeLabels.prize)}
                  type="text"
                  disabled={!customTemplate}
                  component={InputField}
                  inputAddon={<Currency code={currency} />}
                  inputAddonPosition="left"
                  position="vertical"
                  id={`${FORM_NAME}-prize`}
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
                  id={`${FORM_NAME}-money-type-priority`}
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
                  id={`${FORM_NAME}-lock-strategy`}
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
                  id={`${FORM_NAME}-max-bet`}
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
                  id={`${FORM_NAME}-bonus-life-time`}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Field
                  name="claimable"
                  type="checkbox"
                  component="input"
                  disabled={!customTemplate}
                /> {I18n.t('COMMON.CLAIMABLE')}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-default-outline mr-auto"
              disabled={submitting}
              type="reset"
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pristine || submitting || invalid}
              id={`${FORM_NAME}-save-button`}
            >
              {I18n.t('COMMON.SAVE')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  initialValues: {
    moneyTypePriority: moneyTypeUsage.REAL_MONEY_FIRST,
    claimable: false,
    lockAmountStrategy: lockAmountStrategy.LOCK_ALL,
  },
  validate: (values) => {
    const rules = {
      name: ['string', 'required'],
      bonusLifeTime: ['integer', 'min:1', 'max:230', 'required'],
      moneyTypePriority: ['string', 'required'],
      lockAmountStrategy: ['string', 'required'],
      grantRatio: ['numeric', 'required'],
      prize: ['numeric', 'min:0'],
      capping: ['numeric', 'min:0'],
      wageringRequirement: ['numeric', 'required'],
    };

    if (values.prize) {
      const value = parseFloat(values.prize).toFixed(2);

      if (!isNaN(value)) {
        rules.capping.push('greaterThan:prize');
      }
    }

    if (values.capping) {
      const value = parseFloat(values.capping).toFixed(2);

      if (!isNaN(value)) {
        rules.prize.push('lessThan:capping');
      }
    }

    return createValidator(rules, translateLabels(attributeLabels), false)(values);
  },
})(CreateModal);
