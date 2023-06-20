import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { useAddExistingOperatorMutation } from './graphql/__generated__/AddExistingOperatorMutation';
import './ExistingOperatorModal.scss';

export type Props = {
  branchId: string,
  department: string,
  email: string,
  role: string,
  userType: string,
  onCloseModal: () => void,
};

const ExistingOperatorModal = (props: Props) => {
  const { branchId, department, email, role, userType, onCloseModal } = props;

  const history = useHistory();

  // ===== Requests ===== //
  const [addExistingOperatorMutation] = useAddExistingOperatorMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      const { data } = await addExistingOperatorMutation({
        variables: { email, department, role, branchId, userType },
      });

      const uuid = data?.operator?.addExistingOperator?.uuid;

      if (uuid) {
        history.push(`/operators/${uuid}/profile`);
      }

      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.TITLE'),
        message: error.message || I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  };

  return (
    <Modal className="ExistingOperatorModal" toggle={onCloseModal} isOpen>
      <ModalHeader toggle={onCloseModal}>
        {I18n.t('MODALS.EXISTING_OPERATOR_MODAL.TITLE')}
      </ModalHeader>

      <ModalBody>
        {I18n.t('MODALS.EXISTING_OPERATOR_MODAL.MESSAGE')}
        {' '}
        <b>{I18n.t('MODALS.EXISTING_OPERATOR_MODAL.BRAND', { brand: getBrand().id })}</b>
      </ModalBody>

      <ModalFooter>
        <Button
          onClick={onCloseModal}
          className="ExistingOperatorModal__button"
          data-testid="ExistingOperatorModal-cancelButton"
          tertiary
        >
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </Button>

        <Button
          className="ExistingOperatorModal__button"
          data-testid="ExistingOperatorModal-createAndOpenButton"
          onClick={handleSubmit}
          primary
        >
          {I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ExistingOperatorModal);
