import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  InputField, SelectField, CustomValueFieldVertical,
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

class CreateBonusModal extends PureComponent {
  static propTypes = {
    addBonus: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    destroy: PropTypes.func.isRequired,
    optionCurrencies: PropTypes.shape({
      options: PropTypes.shape({
        signUp: PropTypes.shape({
          currency: PropTypes.shape({
            list: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
      }),
    }).isRequired,
    onSave: PropTypes.func,
  };

  static defaultProps = {
    onSave: null,
  };

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
      claimable: formData.claimable,
      bonusLifeTime: formData.bonusLifeTime,
      moneyTypePriority: formData.moneyTypePriority,
    };

    const currency = formData.currency;

    ['grantRatio', 'capping', 'prize'].forEach((key) => {
      if (formData[key] && formData[key].value) {
        if (formData[key].type !== customValueFieldTypes.PERCENTAGE) {
          data[`${key}Absolute`] = [{
            amount: formData[key].value,
            currency,
          }];
        } else {
          data[`${key}Percentage`] = formData[key].value;
        }
      }
    });

    ['maxBet', 'maxGrantAmount'].forEach((key) => {
      if (formData[key]) {
        data[key] = [{
          amount: formData[key],
          currency,
        }];
      }
    });

    if (formData.wageringRequirement) {
      if (
        !formData.wageringRequirement.type ||
        formData.wageringRequirement.type === customValueFieldTypes.PERCENTAGE
      ) {
        data.wageringRequirementAbsolute = [{
          amount: formData.wageringRequirement.value,
          currency,
        }];
      } else {
        data.wageringRequirementPercentage = formData.wageringRequirement.value;
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
      optionCurrencies: {
        options,
      },
      formValues,
    } = this.props;

    const currencies = get(options, 'signUp.post.currency.list', []);
    const grantRatioType = get(formValues, 'grantRatio.type');

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>Modal header</ModalHeader>

        <form onSubmit={handleSubmit(this.handleSubmitBonusForm)}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="currency"
                  label={I18n.t('COMMON.CURRENCY')}
                  type="select"
                  component={SelectField}
                  position="vertical"
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
                <CustomValueFieldVertical
                  basename={'prize'}
                  label={
                    <span>
                      {I18n.t('CAMPAIGNS.SETTINGS.REWARDS.BONUS.LABEL.MIN_PRIZE')}{' '}
                      <span className="label-additional">{I18n.t('COMMON.OPTIONAL')}</span>
                    </span>
                  }
                />
              </div>
              <div className="col-md-6">
                <CustomValueFieldVertical
                  basename={'capping'}
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
                <CustomValueFieldVertical
                  basename="grantRatio"
                  label={I18n.t(attributeLabels.grant)}
                />
              </div>
              <If condition={grantRatioType === customValueFieldTypes.PERCENTAGE}>
                <div className="col-5">
                  <Field
                    name="maxGrantedAmount"
                    type="text"
                    placeholder="0"
                    label="maxGrantedAmount"
                    component={InputField}
                    position="vertical"
                    iconRightClassName="nas nas-currencies_icon"
                  />
                </div>
              </If>
            </div>
            <div className="row">
              <div className="col-7">
                <CustomValueFieldVertical
                  basename="wageringRequirement"
                  label={I18n.t(attributeLabels.wageringRequirement)}
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
                <Field
                  name="maxBet"
                  type="text"
                  placeholder="0"
                  label={I18n.t(attributeLabels.maxBet)}
                  component={InputField}
                  position="vertical"
                  iconRightClassName="nas nas-currencies_icon"
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
