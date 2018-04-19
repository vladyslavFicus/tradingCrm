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
      destroy,
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
      destroy();
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
        <form onSubmit={handleSubmit(this.handleSubmitBonusForm)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-8">
                <Field
                  name="name"
                  type="text"
                  placeholder=""
                  label={I18n.t(attributeLabels.name)}
                  component={InputField}
                  position="vertical"
                />
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
              <Choose>
                <When condition={prizeCapingType === customValueFieldTypes.PERCENTAGE}>
                  <div className="col-md-4">
                    <Field
                      name="prize.percentage"
                      showErrorMessage={false}
                      placeholder="0"
                      component={InputField}
                      label={
                        <span>
                          {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                          <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                        </span>
                      }
                      type="text"
                      position="vertical"
                    />
                  </div>
                  <div className="col-md-4">
                    <Field
                      name="capping.percentage"
                      showErrorMessage={false}
                      placeholder="0"
                      component={InputField}
                      label={
                        <span>
                          {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING')}{' '}
                          <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                        </span>
                      }
                      type="text"
                      position="vertical"
                    />
                  </div>
                </When>
                <Otherwise>
                  <div className="col-md-4">
                    <MultiCurrencyValue
                      baseName="prize.absolute"
                      label={
                        <span>
                          {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                          <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                        </span>
                      }
                      showErrorMessage={false}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="col-md-4">
                    <MultiCurrencyValue
                      baseName="capping.absolute"
                      label={
                        <span>
                          {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.CAPPING')}{' '}
                          <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                        </span>
                      }
                      showErrorMessage={false}
                      placeholder="0.0"
                    />
                  </div>
                </Otherwise>
              </Choose>
            </div>
            <hr />
            <div className="row">
              <div className="col-7">
                <Field
                  component={TypeValueField}
                  name="grantRatio"
                  label={I18n.t(attributeLabels.grant)}
                />
              </div>
              <If condition={grantRatioType === customValueFieldTypes.PERCENTAGE}>
                <div className="col-5">
                  <MultiCurrencyValue
                    label={I18n.t(attributeLabels.maxGrantedAmount)}
                    baseName="maxGrantAmount"
                  />
                </div>
              </If>
            </div>
            <div className="row">
              <div className="col-7">
                <Field
                  component={TypeValueField}
                  name="wageringRequirement"
                  label={I18n.t(attributeLabels.wageringRequirement)}
                >
                  {
                    Object.keys(wageringRequirementTypes).map(key =>
                      <option key={key} value={key}>{key}</option>
                    )
                  }
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-7">
                <Field
                  name="lockAmountStrategy"
                  label={I18n.t(attributeLabels.lockAmountStrategy)}
                  type="select"
                  component={SelectField}
                  position="vertical"
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
              <div className="col-4">
                <Field
                  name="wagerWinMultiplier"
                  type="text"
                  placeholder="0.00"
                  label={I18n.t(attributeLabels.multiplier)}
                  component={InputField}
                  position="vertical"
                />
              </div>
              <div className="col-5">
                <Field
                  name="moneyTypePriority"
                  type="text"
                  label={I18n.t(attributeLabels.moneyPriority)}
                  component={SelectField}
                  position="vertical"
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
                <MultiCurrencyValue
                  baseName="maxBet"
                  label={I18n.t(attributeLabels.maxBet)}
                />
              </div>
              <div className="col-4 form-row_with-placeholder-right">
                <Field
                  name="bonusLifeTime"
                  type="text"
                  placeholder="0"
                  label={I18n.t(attributeLabels.lifeTime)}
                  component={InputField}
                  position="vertical"
                />
                <span className="right-placeholder">{I18n.t(attributePlaceholders.days)}</span>
              </div>
            </div>
            <div className="form-group">
              <Field
                name="claimable"
                type="checkbox"
                component="input"
              /> {I18n.t('COMMON.CLAIMABLE')}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-7">
                <button
                  type="submit"
                  className="btn btn-primary ml-2"
                  id="create-new-operator-submit-button"
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

export default CreateBonusModal;
