import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, SelectField, CustomValueFieldVertical } from '../../../../../../../../components/ReduxForm';
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
import { wageringRequirementTypes } from '../../../../../../../../constants/bonus-template';

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
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    templates: [],
  };

  state = {
    useTemplate: false,
  };

  componentDidMount() {
    this.props.fetchBonusTemplates();
  }

  handleChangeTemplate = (e) => {
    const templateUUID = e.target.value;
    this.props.change('templateUUID', templateUUID);

    this.loadTemplateData(templateUUID);
  };

  loadTemplateData = async (templateUUID) => {
    const { fetchBonusTemplate, change } = this.props;
    const action = await fetchBonusTemplate(templateUUID);

    if (action && !action.error) {
      const {
        name,
        wageringRequirement,
        moneyTypePriority,
        lockAmountStrategyValue,
        maxBet,
        bonusLifeTime,
        claimable,
      } = action.payload;

      change('name', name);
      change('grantRatio', get(action.payload, 'grantRatio.value.currencies[0].amount'));

      if (wageringRequirement) {
        const value = wageringRequirement.ratioType === 'ABSOLUTE'
          ? get(wageringRequirement, 'value.currencies[0].amount')
          : get(wageringRequirement, 'percentage');

        change('wageringRequirement.type', wageringRequirement.ratioType);
        change('wageringRequirement.value', value);
      }

      change('maxBet', get(maxBet, 'currencies[0].amount', ''));
      change('moneyTypePriority', moneyTypePriority);
      change('lockAmountStrategy', lockAmountStrategyValue);
      change('bonusLifeTime', bonusLifeTime);
      change('claimable', claimable);
    }
  };

  toggleUseTemplate = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (value) {
      this.props.change('templateUUID', '');
    }

    this.setState({
      useTemplate: value,
    });
  };

  handleSubmit = data => this.props.onSubmit(this.state.useTemplate, data);

  render() {
    const {
      handleSubmit,
      onClose,
      pristine,
      submitting,
      invalid,
      templates,
    } = this.props;

    const { useTemplate } = this.state;

    return (
      <Modal className="create-bonus-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="templateUUID"
                  label={I18n.t(attributeLabels.template)}
                  labelClassName="form-label"
                  position="vertical"
                  component={SelectField}
                  showErrorMessage={false}
                  onChange={this.handleChangeTemplate}
                  disabled={!useTemplate}
                >
                  <option value="">{I18n.t('BONUS_CAMPAIGNS.REWARDS.FREE_SPIN.CHOOSE_TEMPLATE')}</option>
                  {templates.map(item => (
                    <option key={item.uuid} value={item.uuid}>
                      {item.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <div className="form-group margin-top-15">
                  <label>
                    <input
                      type="checkbox"
                      onChange={this.toggleUseTemplate}
                      checked={useTemplate}
                    /> {I18n.t(attributeLabels.useTemplate)}
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <Field
                  name="name"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.name)}
                  component={InputField}
                  position="vertical"
                  disabled={useTemplate}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field
                  name="grantRatio"
                  placeholder="0"
                  label={I18n.t(attributeLabels.grantedAmount)}
                  component={InputField}
                  position="vertical"
                  type="number"
                  normalize={floatNormalize}
                  disabled={useTemplate}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <CustomValueFieldVertical
                  basename="wageringRequirement"
                  label={I18n.t(attributeLabels.wageringRequirement)}
                  valueFieldProps={{
                    type: 'number',
                    normalize: floatNormalize,
                  }}
                  disabled={useTemplate}
                >
                  {
                    Object.keys(wageringRequirementTypes).map(key =>
                      <option key={key} value={key}>{key}</option>
                    )
                  }
                </CustomValueFieldVertical>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field
                  name="moneyTypePriority"
                  type="text"
                  label="Money type priority"
                  component={SelectField}
                  position="vertical"
                  disabled={useTemplate}
                >
                  {Object.keys(moneyTypeUsage).map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, moneyTypeUsageLabels)}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <Field
                  name="lockAmountStrategy"
                  label={I18n.t(attributeLabels.lockAmountStrategy)}
                  type="select"
                  component={SelectField}
                  position="vertical"
                  disabled={useTemplate}
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
              <div className="col-md-6">
                <Field
                  name="maxBet"
                  placeholder="0"
                  label={I18n.t(attributeLabels.maxBet)}
                  component={InputField}
                  position="vertical"
                  type="number"
                  normalize={floatNormalize}
                  disabled={useTemplate}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name="bonusLifeTime"
                  type="number"
                  placeholder="0"
                  normalize={floatNormalize}
                  label={I18n.t(attributeLabels.lifeTime)}
                  component={InputField}
                  position="vertical"
                  disabled={useTemplate}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Field
                  name="claimable"
                  type="checkbox"
                  component="input"
                  disabled={useTemplate}
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
              id="manual-bonus-modal-save-button"
            >
              {I18n.t('COMMON.SAVE')}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'bonusManage';

export default reduxForm({
  form: FORM_NAME,
  initialValues: {
    moneyTypePriority: moneyTypeUsage.REAL_MONEY_FIRST,
    claimable: false,
    grantRatio: {
      type: customValueFieldTypes.ABSOLUTE,
    },
    wageringRequirement: {
      type: customValueFieldTypes.ABSOLUTE,
    },
    lockAmountStrategy: lockAmountStrategy.LOCK_ALL,
  },
  validate: (values) => {
    const rules = {
      name: ['string', 'required'],
      bonusLifeTime: ['integer', 'min:1', 'max:230', 'required'],
      moneyTypePriority: ['string', 'required'],
      lockAmountStrategy: ['string', 'required'],
      grantRatio: ['numeric', 'required'],
      wageringRequirement: {
        type: ['string', 'required'],
        value: ['numeric', 'required'],
      },
    };

    return createValidator(rules, translateLabels(attributeLabels), false)(values);
  },
})(CreateModal);
