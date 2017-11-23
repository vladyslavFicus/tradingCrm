import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { InputField, DateTimeField, SelectField } from '../../../../../../../../components/ReduxForm';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { moneyTypeUsageLabels } from '../../../../../../../../constants/bonus';
import { attributeLabels, lockAmountStrategyLabels } from './constants';

class CreateModal extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    invalid: false,
    disabled: false,
  };

  handleValidateExpirationDate = current => current.isAfter(moment());

  render() {
    const { onSubmit, handleSubmit, onClose, pristine, submitting, disabled, invalid } = this.props;

    return (
      <Modal className="create-bonus-modal" toggle={onClose} isOpen>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
                <Field
                  name="label"
                  label={I18n.t(attributeLabels.label)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-name"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Field
                  name="priority"
                  label={I18n.t(attributeLabels.priority)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-priority"
                />
              </div>
              <div className="col-md-3">
                <Field
                  utc
                  id="manual-bonus-modal-expiration-date"
                  name="expirationDate"
                  label={I18n.t(attributeLabels.expirationDate)}
                  labelClassName={null}
                  disabled={disabled}
                  component={DateTimeField}
                  position="vertical"
                  isValidDate={this.handleValidateExpirationDate}
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="grantedAmount"
                  label={I18n.t(attributeLabels.grantedAmount)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-granted-amount"
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="amountToWage"
                  label={I18n.t(attributeLabels.amountToWage)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-amount-to-wage"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Field
                  name="capping"
                  label={I18n.t(attributeLabels.capping)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-capping"
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="prize"
                  label={I18n.t(attributeLabels.prize)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                  id="manual-bonus-modal-prize"
                />
              </div>
              <div className="col-md-3">
                <Field
                  name="moneyTypePriority"
                  label={I18n.t(attributeLabels.moneyTypePriority)}
                  type="select"
                  component={SelectField}
                  position="vertical"
                >
                  {Object.keys(moneyTypeUsageLabels).map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, moneyTypeUsageLabels)}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-3">
                <Field
                  name="lockAmountStrategy"
                  label={I18n.t(attributeLabels.lockAmountStrategy)}
                  type="select"
                  component={SelectField}
                  position="vertical"
                >
                  {Object.keys(lockAmountStrategyLabels).map(key => (
                    <option key={key} value={key}>
                      {renderLabel(key, lockAmountStrategyLabels)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-md-12">
                <div className="checkbox">
                  <label>
                    <Field
                      name="claimable"
                      type="checkbox"
                      component="input"
                      id="create-campaign-claimable"
                    /> {I18n.t(attributeLabels.claimable)}
                  </label>
                </div>
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
  validate: (values) => {
    const rules = {
      playerUUID: 'required|string',
      label: 'required|string',
      priority: 'required|numeric|min:0',
      grantedAmount: 'required|numeric|min:0',
      amountToWage: 'required|numeric|min:0',
      expirationDate: 'required',
      prize: ['numeric', 'min:0'],
      capping: ['numeric', 'min:0'],
      converted: 'required',
      wagered: 'required',
      currency: 'required',
      lockAmountStrategy: 'required',
    };

    if (values.prize && values.prize.value) {
      const value = parseFloat(values.prize.value).toFixed(2);

      if (!isNaN(value)) {
        rules.capping.value.push('greaterThan:prize');
      }
    }

    if (values.capping && values.capping.value) {
      const value = parseFloat(values.capping.value).toFixed(2);

      if (!isNaN(value)) {
        rules.prize.value.push('lessThan:capping');
      }
    }

    return createValidator(rules, translateLabels(attributeLabels), false)(values);
  },
})(CreateModal);
