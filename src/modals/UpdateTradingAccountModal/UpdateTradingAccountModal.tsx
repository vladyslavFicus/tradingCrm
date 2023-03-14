import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useUpdateTradingAccountMutation } from './graphql/__generated__/UpdateTradingAccountMutation';
import './UpdateTradingAccountModal.scss';

const attributeLabels = {
  name: 'MODALS.UPDATE_TRADING_ACCOUNT_MODAL.LABLES.NAME',
};

type FormValues = {
  name: string,
};

export type Props = {
  accountUUID: string,
  name: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTradingAccountModal = (props: Props) => {
  const { accountUUID, name, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateTradingAccountMutation] = useUpdateTradingAccountMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateTradingAccountMutation({ variables: { ...values, accountUUID } });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.ERROR'),
      });
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ name }}
        validate={createValidator({
          name: ['required', 'string'],
        }, translateLabels(attributeLabels), false)}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
              <Field
                name="name"
                label={I18n.t(attributeLabels.name)}
                placeholder={I18n.t('COMMON.NAME')}
                component={FormikInputField}
                disabled={isSubmitting}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                className="UpdateTradingAccountModal__button"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="UpdateTradingAccountModal__button"
                disabled={isSubmitting}
                type="submit"
                primary
              >
                {I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.UPDATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateTradingAccountModal);
