import React from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { Config, parseErrors, notify, Types } from '@crm/common';
import Modal from 'components/Modal';
import { useAddExistingOperatorMutation } from './graphql/__generated__/AddExistingOperatorMutation';

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

  const navigate = useNavigate();

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
        navigate(`/operators/${uuid}`);
      }

      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.TITLE'),
        message: error.message || I18n.t('MODALS.EXISTING_OPERATOR_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
      });
    }
  };

  return (
    <Modal
      onCloseModal={onCloseModal}
      title={I18n.t('MODALS.EXISTING_OPERATOR_MODAL.TITLE')}
      clickSubmit={handleSubmit}
      buttonTitle={I18n.t('COMMON.BUTTONS.CREATE_AND_OPEN')}
    >
      {I18n.t('MODALS.EXISTING_OPERATOR_MODAL.MESSAGE')}
      {' '}
      <b>{I18n.t('MODALS.EXISTING_OPERATOR_MODAL.BRAND', { brand: Config.getBrand().id })}</b>
    </Modal>
  );
};

export default React.memo(ExistingOperatorModal);
