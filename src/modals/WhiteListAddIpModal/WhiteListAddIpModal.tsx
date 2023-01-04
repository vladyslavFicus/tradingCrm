import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { createValidator } from 'utils/validator';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import { FormikInputField } from 'components/Formik';
import { useIpWhitelistAddIpMutation } from './graphql/__generated__/IpWhitelistAddIpMutation';
import './WhiteListAddIpModal.scss';

const validate = createValidator(
  {
    ip: ['required', 'IP'],
    description: ['required', 'string', 'min:3'],
  },
  {
    ip: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.IP_ADDRESS'),
    description: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.DESCRIPTION'),
  },
  false,
);

type FormValues = {
  ip: string,
  description: string,
};

type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const WhiteListAddIpModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [ipWhitelistAddIpMutation] = useIpWhitelistAddIpMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await ipWhitelistAddIpMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.NOTIFICATIONS.IP_ADDED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        formikHelpers.setFieldError('ip', I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.NOTIFICATIONS.IP_NOT_ADDED'),
        });
      }
    }
  };

  return (
    <Modal className="WhiteListAddIpModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{ ip: '', description: '' }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
              <Field
                name="ip"
                label={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.IP_ADDRESS')}
                component={FormikInputField}
              />

              <Field
                name="description"
                label={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.DESCRIPTION')}
                component={FormikInputField}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="WhiteListAddIpModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="WhiteListAddIpModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.ADD_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(WhiteListAddIpModal);
