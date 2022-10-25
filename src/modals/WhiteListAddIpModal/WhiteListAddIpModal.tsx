import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { BaseMutationOptions, MutationResult } from '@apollo/client';
import { parseErrors, withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { Notify, LevelType } from 'types/notify';
import { Button } from 'components/UI';
import { FormikInputField } from 'components/Formik';
import IpWhitelistAddMutation from './graphql/IpWhitelistAddMutation';
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

interface IpWhitelistAddress {
  ipWhitelist: {
    ip: string,
    description: string,
  },
}
interface FormValues {
  ip: string,
  description: string,
}

type Props = {
  onCloseModal: () => void,
  isOpen: boolean,
  notify: Notify,
  addIp: (options: BaseMutationOptions) => MutationResult<IpWhitelistAddress>,
  onSuccess: () => void,
};

const WhiteListAddIpModal = (props: Props) => {
  const { onCloseModal, isOpen, notify, onSuccess, addIp } = props;
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await addIp({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.NOTIFICATIONS.IP_ADDED'),
      });

      onCloseModal();
      onSuccess();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.entity.already.exist') {
        formikHelpers.setFieldError(
          'ip',
          I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.ERRORS.UNIQUE'),
        );
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
    <Modal className="WhiteListAddIpModal" toggle={onCloseModal} isOpen={isOpen}>
      <Formik
        initialValues={{ ip: '', description: '' }}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>{I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.TITLE')}</ModalHeader>
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

export default compose(
  React.memo,
  withNotifications,
  withRequests({
    addIp: IpWhitelistAddMutation,
  }),
)(WhiteListAddIpModal);
