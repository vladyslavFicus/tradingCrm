import React, { Component, PropTypes } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { InputField, SingleDateField, SelectField } from '../../../../../../components/ReduxForm';
import { createValidator } from '../../../../../../utils/validator';
import './CreateModal.scss';

const FORM_NAME = 'bonusManage';
const attributeLabels = {
  playerUUID: 'Player UUID',
  label: 'Name',
  priority: 'Priority',
  currency: 'Currency',
  state: 'State',
  grantedAmount: 'Granted amount',
  amountToWage: 'Amount to wage',
  createdDate: 'Created date',
  expirationDate: 'Expiration date',
  prize: 'Prize',
  capping: 'Capping',
  optIn: 'Opt-in',
  converted: 'Converted',
  wagered: 'Wagered',
};
const validator = createValidator({
  playerUUID: 'required|string',
  label: 'required|string',
  priority: 'required|numeric|min:0',
  grantedAmount: 'required|numeric|min:0',
  amountToWage: 'required|numeric|min:0',
  createdDate: 'required',
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
    onMount: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    currencies: PropTypes.array,
    onClose: PropTypes.func.isRequired,
  };
  static defaultProps = {
    currencies: [],
    onMount: null,
  };

  componentDidMount() {
    if (typeof this.props.onMount === 'function') {
      this.props.onMount();
    }
  }

  handleResetForm = () => {
    this.props.reset();
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
      currencies,
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
                  label={attributeLabels.label}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="playerUUID"
                  label={attributeLabels.playerUUID}
                  type="text"
                  disabled
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="grantedAmount"
                  label={attributeLabels.grantedAmount}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="prize"
                  label={attributeLabels.prize}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="expirationDate"
                  label={attributeLabels.expirationDate}
                  disabled={disabled}
                  component={SingleDateField}
                  onChange={this.props.change}
                  position="vertical"
                />
              </div>
              <div className="col-md-6">
                <Field
                  name="priority"
                  label={attributeLabels.priority}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="currency"
                  label={attributeLabels.currency}
                  type="select"
                  disabled={disabled}
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('PLAYER_PROFILE.BONUS.MODAL_CREATE.CHOOSE_CURRENCY')}</option>
                  {currencies.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>

                <Field
                  name="amountToWage"
                  label={attributeLabels.amountToWage}
                  type="text"
                  disabled={disabled}
                  component={InputField}
                  position="vertical"
                />

                <Field
                  name="capping"
                  label={attributeLabels.capping}
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
                        /> {attributeLabels.optIn}
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
                  Cancel
                </button>
              </div>
              <div className="col-md-6 text-right">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pristine || submitting || invalid}
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

export default reduxForm({
  form: FORM_NAME,
  validate: validator,
})(CreateModal);
