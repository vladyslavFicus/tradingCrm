import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { useIpWhitelistUpdateIpMutation } from './graphql/__generated__/IpWhitelistUpdateIpMutation';
import './WhiteListUpdateDescriptionModal.scss';

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

type IpWhitelistAddress = {
  ip: string,
  uuid: string,
  description: string,
};

type FormValues = {
  ip: string,
  uuid: string,
  description: string,
};

type Props = {
  item: IpWhitelistAddress,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const WhiteListUpdateDescriptionModal = (props: Props) => {
  const { item, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [ipWhitelistUpdateIpMutation] = useIpWhitelistUpdateIpMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const { description, uuid } = values;

    try {
      await ipWhitelistUpdateIpMutation({ variables: { description, uuid } });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.NOTIFICATIONS.IP_UPDATED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.NOTIFICATIONS.IP_NOT_UPDATED'),
      });
    }
  };

  return (
    <Modal className="WhiteListUpdateDescriptionModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={item}
        validate={validate}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.TITLE')}
            </ModalHeader>

            <ModalBody>
              <Field
                name="ip"
                label={I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.IP_ADDRESS')}
                component={FormikInputField}
                disabled
              />

              <Field
                name="description"
                label={I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.DESCRIPTION')}
                component={FormikInputField}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="WhiteListUpdateDescriptionModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="WhiteListUpdateDescriptionModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.UPDATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(WhiteListUpdateDescriptionModal);
