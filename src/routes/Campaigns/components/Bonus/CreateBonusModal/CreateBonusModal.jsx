import React, { PureComponent } from 'react';
import { get, mapValues, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  InputField, SelectField, MultiCurrencyValue, TypeValueField,
} from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders, wageringRequirementTypes } from '../constants';
import {
  moneyTypeUsage,
  moneyTypeUsageLabels,
  lockAmountStrategy,
  lockAmountStrategyLabels,
} from '../../../../../constants/bonus-campaigns';
import { customValueFieldTypes, customValueFieldTypesLabels } from '../../../../../constants/form';
import { attributeLabels as modalAttributeLabels } from './constants';

class CreateBonusModal extends PureComponent {
  static propTypes = {
    addBonus: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    formValues: PropTypes.object,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    onSave: null,
    formValues: {},
  };

  componentWillReceiveProps({ isOpen }) {
    if (this.props.isOpen && !isOpen) {
      this.props.reset();
    }
  }

  handleSubmitBonusForm = async (formData) => {
    const {
      addBonus,
      notify,
      onSave,
      onCloseModal,
      reset,
    } = this.props;

    const data = {
      name: formData.name,
      lockAmountStrategy: formData.lockAmountStrategy,
      claimable: !!formData.claimable,
      bonusLifeTime: formData.bonusLifeTime,
      moneyTypePriority: formData.moneyTypePriority,
      maxBet: formData.maxBet,
      maxGrantAmount: formData.maxGrantAmount,
    };

    ['grantRatio', 'wageringRequirement'].forEach((key) => {
      if (formData[key].type === customValueFieldTypes.ABSOLUTE) {
        data[`${key}Absolute`] = formData[key].absolute;
      } else {
        data[`${key}Percentage`] = formData[key].percentage;
      }
    });

    if (formData.prizeCapingType === customValueFieldTypes.ABSOLUTE) {
      if (formData.capping) {
        data.cappingAbsolute = formData.capping.absolute;
      }

      if (formData.prize) {
        data.prizeAbsolute = formData.prize.absolute;
      }
    } else {
      if (formData.capping) {
        data.cappingPercentage = formData.capping.percentage;
      }

      if (formData.prize) {
        data.prizePercentage = formData.prize.percentage;
      }
    }

    data.wageringRequirementType = formData.wageringRequirement.type;

    const response = await addBonus({ variables: data });
    const { error, fields_errors } = get(response, 'data.bonusTemplate.add.error') || {};

    if (!isEmpty(fields_errors)) {
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

    if (!error) {
      const uuid = get(response, 'data.bonusTemplate.add.data.uuid');

      if (onSave) {
        onSave(uuid);
      }

      onCloseModal();
      reset();
    }
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      formValues,
    } = this.props;

    const grantRatioType = get(formValues, 'grantRatio.type');
    const prizeCapingType = get(formValues, 'prizeCapingType');

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>
          {I18n.t(modalAttributeLabels.title)}
        </ModalHeader>
        <ModalBody id="create-bonus-modal-form" tag="form" onSubmit={handleSubmit(this.handleSubmitBonusForm)}>
          <div className="row">
            <Field
              name="name"
              type="text"
              label={I18n.t(attributeLabels.name)}
              component={InputField}
              position="vertical"
              className="col-md-8"
              id="campaign-create-bonus-modal-name"
            />
          </div>
          <div className="row">
            <Field
              name="prizeCapingType"
              label={I18n.t(attributeLabels.prizeCapingType)}
              type="select"
              component={SelectField}
              position="vertical"
              className="col-md-4"
              id="campaign-create-bonus-modal-prize-caping-type"
            >
              {Object.keys(customValueFieldTypes).map(key =>
                (
                  <option key={key} value={key}>
                    {renderLabel(key, customValueFieldTypesLabels)}
                  </option>
                )
              )}
            </Field>
            <Choose>
              <When condition={prizeCapingType === customValueFieldTypes.PERCENTAGE}>
                <Field
                  name="prize.percentage"
                  showErrorMessage={false}
                  placeholder="0"
                  component={InputField}
                  label={
                    <div>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </div>
                  }
                  type="text"
                  position="vertical"
                  className="col-md-4"
                  id="campaign-create-bonus-modal-min-prize-percentage"
                />
                <Field
                  name="capping.percentage"
                  showErrorMessage={false}
                  placeholder="0"
                  component={InputField}
                  label={
                    <div>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </div>
                  }
                  type="text"
                  position="vertical"
                  className="col-md-4"
                  id="campaign-create-bonus-modal-capping-percentage"
                />
              </When>
              <Otherwise>
                <MultiCurrencyValue
                  baseName="prize.absolute"
                  label={
                    <div>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </div>
                  }
                  showErrorMessage={false}
                  placeholder="0.0"
                  className="col-md-4"
                  id="campaign-create-bonus-modal-min-prize-absolute"
                />
                <MultiCurrencyValue
                  baseName="capping.absolute"
                  label={
                    <div>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </div>
                  }
                  showErrorMessage={false}
                  placeholder="0.0"
                  className="col-md-4"
                  id="campaign-create-bonus-modal-capping-absolute"
                />
              </Otherwise>
            </Choose>
          </div>
          <hr />
          <div className="row">
            <Field
              component={TypeValueField}
              name="grantRatio"
              label={I18n.t(attributeLabels.grant)}
              className="col-md-7"
              id="campaign-create-bonus-modal-grant-ratio"
            />
            <If condition={grantRatioType === customValueFieldTypes.PERCENTAGE}>
              <MultiCurrencyValue
                label={I18n.t(attributeLabels.maxGrantAmount)}
                baseName="maxGrantAmount"
                className="col-md-5"
                id="campaign-create-bonus-modal-max-granted-amount"
              />
            </If>
          </div>
          <div className="row">
            <Field
              component={TypeValueField}
              name="wageringRequirement"
              label={I18n.t(attributeLabels.wageringRequirement)}
              className="col-md-7"
              id="campaign-create-bonus-modal-wagering"
            >
              {Object.keys(wageringRequirementTypes).map(key =>
                <option key={key} value={key}>{key}</option>
              )}
            </Field>
          </div>
          <div className="row">
            <Field
              name="lockAmountStrategy"
              label={I18n.t(attributeLabels.lockAmountStrategy)}
              type="select"
              component={SelectField}
              position="vertical"
              className="col-md-7"
              id="campaign-create-bonus-modal-lock-amount-strategy"
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(lockAmountStrategy).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, lockAmountStrategyLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="row">
            <Field
              name="wagerWinMultiplier"
              type="text"
              placeholder="0.00"
              label={I18n.t(attributeLabels.multiplier)}
              component={InputField}
              position="vertical"
              className="col-md-4"
              id="campaign-create-bonus-modal-wager-win-multiplier"
            />
            <Field
              name="moneyTypePriority"
              type="text"
              label={I18n.t(attributeLabels.moneyPriority)}
              component={SelectField}
              position="vertical"
              className="col-md-5"
              id="campaign-create-bonus-modal-money-type-priority"
            >
              <option value="">{I18n.t('COMMON.SELECT_OPTION.DEFAULT')}</option>
              {Object.keys(moneyTypeUsage).map(key => (
                <option key={key} value={key}>
                  {renderLabel(key, moneyTypeUsageLabels)}
                </option>
              ))}
            </Field>
          </div>
          <div className="row">
            <MultiCurrencyValue
              baseName="maxBet"
              label={I18n.t(attributeLabels.maxBet)}
              className="col-md-4"
              id="campaign-create-bonus-modal-max-bet"
            />
            <div className="col-md-4 form-row_with-placeholder-right">
              <Field
                name="bonusLifeTime"
                type="text"
                placeholder="0"
                label={I18n.t(attributeLabels.lifeTime)}
                component={InputField}
                position="vertical"
                id="campaign-create-bonus-modal-bonus-life-time"
              />
              <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
            </div>
          </div>
          <div className="form-group">
            <Field
              name="claimable"
              type="checkbox"
              component="input"
              id="campaign-create-bonus-modal-claimable-checkbox"
            /> {I18n.t('COMMON.CLAIMABLE')}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="submit"
            className="btn btn-primary"
            form="create-bonus-modal-form"
          >
            {I18n.t('COMMON.SAVE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreateBonusModal;
