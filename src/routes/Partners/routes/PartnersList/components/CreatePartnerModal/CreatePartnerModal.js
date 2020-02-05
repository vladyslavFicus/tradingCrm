import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field } from 'redux-form';
import I18n from 'i18n-js';
import Regulated from 'components/Regulated';
import CheckBox from 'components/ReduxForm/CheckBox';
import reduxFieldsConstructor from 'components/ReduxForm/ReduxFieldsConstructor';
import { generate } from 'utils/password';
import { formFields } from './constants';
import './CreatePartnerModal.scss';

class CreatePartnerModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    change: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    valid: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    pristine: false,
    submitting: false,
    valid: false,
    change: null,
  };

  handleGeneratePassword = () => {
    this.props.change('password', generate());
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      submitting,
      onSubmit,
      pristine,
      isOpen,
      valid,
    } = this.props;

    return (
      <Modal className="create-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('PARTNERS.NEW_PARTNER')}</ModalHeader>
        <ModalBody id="create-operator-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="row row__margin-bottom">
            {reduxFieldsConstructor(
              formFields(this.handleGeneratePassword),
            )}
          </div>
          <Regulated>
            <Field
              name="isIB"
              component={CheckBox}
              type="checkbox"
              label="Is IB?"
            />
          </Regulated>
        </ModalBody>
        <ModalFooter className="modal-footer__create-partner">
          <div className="row">
            <div className="col-7">
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <button
                type="submit"
                disabled={pristine || submitting || !valid}
                className="btn btn-primary ml-2"
                id="create-new-operator-submit-button"
                form="create-operator-modal-form"
              >
                {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CreatePartnerModal;
