import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { InputField, SingleDateField, SelectField } from '../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../utils/validator';
import { attributeLabels } from './constants';
import './CreateModal.scss';

const FORM_NAME = 'bonusManage';
const validator = createValidator({
  playerUUID: 'required|string',
  label: 'required|string',
  priority: 'required|numeric|min:0',
  grantedAmount: 'required|numeric|min:0',
  amountToWage: 'required|numeric|min:0',
  expirationDate: 'required',
  prize: 'required_if:capping|numeric|min:0',
  capping: 'numeric|required_if:prize|min:0',
  optIn: 'boolean',
  converted: 'required',
  wagered: 'required',
  currency: 'required',
}, attributeLabels, false);

class CreateModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    reset: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const {
      onSubmit,
      handleSubmit,
      onClose,
      isOpen,
      pristine,
      submitting,
      disabled,
      invalid,
    } = this.props;

    return (
      <Modal className="create-bonus-modal" toggle={onClose} isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.TITLE')}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <Field
                  name="label"
                  label={I18n.t(attributeLabels.label)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="grantedAmount"
                  label={I18n.t(attributeLabels.grantedAmount)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="prize"
                  label={I18n.t(attributeLabels.prize)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="expirationDate"
                  label={I18n.t(attributeLabels.expirationDate)}
                  disabled={disabled}
                  component={SingleDateField}
                  position="vertical"
                />
              </div>
              <div className="col-md-6">
                <Field
                  name="priority"
                  label={I18n.t(attributeLabels.priority)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="amountToWage"
                  label={I18n.t(attributeLabels.amountToWage)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="capping"
                  label={I18n.t(attributeLabels.capping)}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <div className={classNames('form-group row')}>
                  <div className="col-md-9 col-md-offset-3">
                    <div className="checkbox">
                      <label>
                        <Field
                          name="optIn"
                          type="checkbox"
                          component="input"
                          disabled={disabled}
                        /> {I18n.t(attributeLabels.optIn)}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="row">
              <div className="col-md-6">
                <button
                  className="btn btn-default-outline"
                  disabled={submitting}
                  type="reset"
                  onClick={onClose}
                >
                  {I18n.t('COMMON.CANCEL')}
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pristine || submitting || invalid}
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

export default reduxForm({
  form: FORM_NAME,
  validate: validator,
})(CreateModal);
