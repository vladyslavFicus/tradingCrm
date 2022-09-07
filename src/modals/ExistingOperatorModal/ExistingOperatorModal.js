import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { withNotifications } from 'hoc';
import { withRequests, parseErrors } from 'apollo';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import AddExistingOperatorMutation from './graphql/AddExistingOperatorMutation';
import './ExistingOperatorModal.scss';

class ExistingOperatorModal extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    branchId: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired,
    addExistingOperator: PropTypes.func.isRequired,
  };

  handleSubmitExistingOperator = async () => {
    const {
      addExistingOperator,
      email,
      department,
      role,
      branchId,
      onCloseModal,
      userType,
      notify,
      history,
    } = this.props;

    try {
      const response = await addExistingOperator({
        variables: {
          email,
          department,
          role,
          branchId,
          userType,
        },
      });

      const uuid = response.data?.operator?.addExistingOperator?.uuid;

      if (uuid) {
        history.push(`/operators/${uuid}/profile`);
      }

      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.TITLE'),
        message: error.message || I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const {
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal className="ExistingOperatorModal" toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.EXISTING_OPERATOR_MODAL.TITLE')}</ModalHeader>
        <ModalBody>
          {I18n.t('MODALS.EXISTING_OPERATOR_MODAL.MESSAGE')}
          {' '}
          <b>{I18n.t('MODALS.EXISTING_OPERATOR_MODAL.BRAND', { brand: getBrand().id })}</b>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onCloseModal}
            className="ExistingOperatorModal__button"
            commonOutline
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </Button>

          <Button
            className="ExistingOperatorModal__button"
            onClick={this.handleSubmitExistingOperator}
            primary
          >
            {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  withNotifications,
  withRequests({
    addExistingOperator: AddExistingOperatorMutation,
  }),
)(ExistingOperatorModal);
