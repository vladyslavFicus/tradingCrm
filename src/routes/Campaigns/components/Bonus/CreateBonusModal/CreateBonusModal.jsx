import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  InputField, SelectField, MultiCurrencyValue, CustomValueFieldVertical,
} from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, attributePlaceholders, wageringRequirementTypes } from '../constants';
import {
  moneyTypeUsage,
  moneyTypeUsageLabels,
  lockAmountStrategy,
  lockAmountStrategyLabels,
} from '../../../../../constants/bonus-campaigns';
import { customValueFieldTypes } from '../../../../../constants/form';
import { attributeLabels as modalAttributeLabels } from './constants';

class CreateBonusModal extends PureComponent {
  static propTypes = {
    addBonus: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    destroy: PropTypes.func.isRequired,
    formValues: PropTypes.object,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    onSave: null,
    formValues: {},
  };

  componentWillReceiveProps({ isOpen }) {
    if (this.props.isOpen && !isOpen) {
      this.props.destroy();
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

    ['grantRatio', 'capping', 'prize'].forEach((key) => {
      if (formData[key].type !== customValueFieldTypes.PERCENTAGE) {
        data[`${key}Absolute`] = formData[key].value;
      } else {
        data[`${key}Percentage`] = formData[key].percentage;
      }
    });

    if (formData.wageringRequirement) {
      if (
        formData.wageringRequirement.type === customValueFieldTypes.ABSOLUTE
      ) {
        data.wageringRequirementAbsolute = formData.wageringRequirement.value;
      } else {
        data.wageringRequirementPercentage = formData.wageringRequirement.percentage;
      }

      data.wageringRequirementType = formData.wageringRequirement.type || customValueFieldTypes.ABSOLUTE;
    }

    const action = await addBonus({ variables: data });
    const error = get(action, 'data.bonusTemplate.add.error');

    notify({
      level: error ? 'error' : 'success',
      title: 'Title',
      message: 'Message',
    });

    if (!error) {
      const uuid = get(action, 'data.bonusTemplate.add.data.uuid');

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

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t(modalAttributeLabels.title)}</ModalHeader>
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
              <div className="col-md-6">
                <Field
                  component={CustomValueFieldVertical}
                  name="prize"
                  label={
                    <span>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </span>
                  }
                />
              </div>
              <div className="col-md-6">
                <Field
                  component={CustomValueFieldVertical}
                  name="capping"
                  label={
                    <span>
                      {I18n.t(attributeLabels.capping)}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </span>
                  }
                />
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-7">
                <Field
                  component={CustomValueFieldVertical}
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
                  component={CustomValueFieldVertical}
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
                  label={I18n.t(attributeLabels.moneyPrior)}
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
                  Save
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
