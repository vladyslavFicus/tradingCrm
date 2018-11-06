import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import NoteButton from '../NoteButton';
import { SelectField, TextAreaField } from '../ReduxForm';
import Uuid from '../Uuid';
import { attributeLabels } from './constants';
import { createValidator, translateLabels } from '../../utils/validator';
import renderLabel from '../../utils/renderLabel';

const CUSTOM_REASON = 'custom';

class PaymentActionReasonModal extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    playerProfile: PropTypes.userProfile.isRequired,
    onNoteClick: PropTypes.func.isRequired,
    payment: PropTypes.paymentEntity.isRequired,
    reasons: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    customReason: PropTypes.bool,
    submitButtonLabel: PropTypes.string,
    currentValues: PropTypes.shape({
      reason: PropTypes.string,
      customReason: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    invalid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    reasons: {},
    submitButtonLabel: 'Submit',
    customReason: false,
    currentValues: {
      action: '',
      playerUUID: '',
      paymentId: '',
      reason: '',
      customReason: '',
    },
    handleSubmit: null,
    className: 'modal-danger',
  };

  handleSubmit = ({ reason, customReason }) => {
    const { onSubmit, action, playerProfile, payment } = this.props;

    return onSubmit(action, playerProfile.playerUUID, payment.paymentId, { reason: customReason || reason });
  };

  renderReasonsSelect = (reasons, customReason = false) => (
    <div className="form-group">
      <Field
        name="reason"
        label={I18n.t(attributeLabels.reason)}
        component={SelectField}
        position="vertical"
      >
        <option value="">{I18n.t('COMMON.SELECT_OPTION.REASON')}</option>
        {Object.keys(reasons).map(key => (
          <option key={key} value={key}>
            {renderLabel(key, reasons)}
          </option>
        ))}
        {
          customReason &&
          <option value="custom">
            {I18n.t('COMMON.CUSTOM_REASON_OPTION')}
          </option>
        }
      </Field>
    </div>
  );

  render() {
    const {
      title,
      description,
      payment,
      playerProfile: {
        playerUUID,
        firstName,
        lastName,
      },
      onClose,
      reasons,
      submitButtonLabel,
      onNoteClick,
      handleSubmit,
      currentValues,
      customReason,
      className,
      invalid,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose} className={classNames(className, 'payment-action-reason-modal')}>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <ModalHeader toggle={onClose}>{title}</ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="font-weight-700">
                  {description}
                </div>
                <div className="font-weight-400">
                  <span className="font-weight-700">{firstName} {lastName}</span>
                  {' '}
                  <Uuid uuid={playerUUID} uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />
                </div>
              </div>
            </div>

            {reasons && Object.keys(reasons).length > 0 && this.renderReasonsSelect(reasons, customReason)}

            {
              currentValues && currentValues.reason === CUSTOM_REASON &&
              <Field
                name="customReason"
                placeholder={I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CUSTOM_REASON_PLACEHOLDER')}
                component={TextAreaField}
              />
            }

            <div className="row">
              <div className="col-md-12 text-center">
                <NoteButton
                  id="payment-action-reason-modal"
                  note={payment.note}
                  onClick={onNoteClick}
                  targetEntity={payment}
                />
              </div>
            </div>

          </ModalBody>

          <ModalFooter>
            <button className="btn btn-default-outline mr-auto" onClick={onClose}>
              {I18n.t('BONUS_CAMPAIGNS.CHANGE_STATUS_MODAL.CANCEL_BUTTON')}
            </button>
            <button
              className="btn btn-danger"
              type="submit"
              disabled={invalid}
            >
              {I18n.t(submitButtonLabel)}
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

const FORM_NAME = 'paymentActionReasonModal';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: (data, props) => {
      const rules = {
        reason: `string|in:${Object.keys(props.reasons).join()},custom`,
      };

      if (data.reason === CUSTOM_REASON) {
        rules.customReason = 'required|string|min:3';
      }

      return createValidator(rules, translateLabels(attributeLabels), false)(data);
    },
  })(PaymentActionReasonModal)
);
