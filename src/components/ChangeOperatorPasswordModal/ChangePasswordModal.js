import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { InputField } from '../ReduxForm';
import attributeLabels from './constants';
import { createValidator } from '../../utils/validator';
import Uuid from '../Uuid';
import { getActiveBrandConfig } from '../../config';

const ChangePasswordModal = ({ onClose, handleSubmit, onSubmit, fullName, operatorUUID }) => (
  <Modal className="modal-danger change-password-modal" toggle={onClose} isOpen>
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalHeader toggle={onClose}>
        {I18n.t('OPERATOR_PROFILE.MODALS.CHANGE_PASSWORD.TITLE')}
      </ModalHeader>
      <ModalBody>
        <div className="change-password-modal-warning">
          {I18n.t('OPERATOR_PROFILE.MODALS.CHANGE_PASSWORD.WARNING_HEADER')}
          <div>
            {I18n.t('COMMON.FOR')}
            {` ${fullName} - `}
            <Uuid className="change-password-modal-uuid" uuid={operatorUUID} />
          </div>
        </div>
        <Field
          name="password"
          type="password"
          label={I18n.t(attributeLabels.newPasswordLabel)}
          component={InputField}
          position="vertical"
        />
        <Field
          name="repeatPassword"
          type="password"
          label={I18n.t(attributeLabels.repeatPasswordLabel)}
          component={InputField}
          position="vertical"
        />
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn btn-default-outline" onClick={onClose}>
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </button>
        <button type="submit" className="btn btn-danger">
          {I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
        </button>
      </ModalFooter>
    </form>
  </Modal>
);

ChangePasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  operatorUUID: PropTypes.string.isRequired,
};

ChangePasswordModal.defaultProps = {
  handleSubmit: null,
};

export default reduxForm({
  form: 'changeOperatorPassword',
  validate: createValidator({
    password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
    repeatPassword: [
      'required',
      'same:password',
    ],
  }, attributeLabels, false),
})(ChangePasswordModal);
