import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { getBrandId } from 'config';
import history from 'router/history';

class ExistingPartnerModal extends Component {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    addExistingOperator: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    branchId: PropTypes.string.isRequired,
  };

  handleSubmitExistingOperator = async (e) => {
    e.preventDefault();

    const {
      addExistingOperator,
      email,
      department,
      role,
      branchId,
      onCloseModal,
      notify,
    } = this.props;

    const {
      data: {
        operator: {
          addExistingOperator: {
            data: {
              uuid,
            },
            error,
          },
        },
      },
    } = await addExistingOperator({
      variables: {
        addExistingOperator,
        email,
        department,
        role,
        branchId,
      },
    });

    if (!error) {
      onCloseModal();

      history.replace(`${uuid}/profile`);
    } else {
      notify({
        level: 'error',
        title: I18n.t('OPERATORS.NOTIFICATIONS.EXISTING_OPERATOR_ERROR.TITLE'),
        message: I18n.t('OPERATORS.NOTIFICATIONS.EXISTING_OPERATOR_ERROR.MESSAGE'),
      });
    }
  }

  render() {
    const {
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal className="existing-operator-modal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('OPERATORS.MODALS.EXISTING_OPERATOR.TITLE')}</ModalHeader>
        <ModalBody id="existing-operator-modal-form" tag="form" onSubmit={this.handleSubmitExistingOperator}>
          {I18n.t('OPERATORS.MODALS.EXISTING_OPERATOR.MESSAGE')}
          <span className="font-weight-700">
            &nbsp;
            {I18n.t('OPERATORS.MODALS.EXISTING_OPERATOR.BRAND', { brand: getBrandId() })}
          </span>
        </ModalBody>
        <ModalFooter>
          <div className="row">
            <div className="col-12">
              <button
                type="button"
                className="btn btn-default-outline"
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </button>
              <button
                type="submit"
                className="btn btn-primary ml-2"
                form="existing-operator-modal-form"
              >
                {I18n.t('COMMON.BUTTONS.YES')}
              </button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ExistingPartnerModal;
