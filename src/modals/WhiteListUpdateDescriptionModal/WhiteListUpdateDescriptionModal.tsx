import React from 'react';
import compose from 'compose-function';
import { withNotifications } from 'hoc';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { MutationOptions, MutationResult } from 'react-apollo';
import { Button } from 'components/UI';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Notify, LevelType } from 'types/notify';
import IpWhitelistEditMutation from './graphql/IpWhitelistEditMutation';
import './WhiteListUpdateDescriptionModal.scss';

interface IpWhitelistEditResponse {
  ipWhitelist: {
    name: string,
    description: string,
  },
}
type IpWhitelistAddress = {
  ip: string,
  uuid: string,
  description?: string,
}
type Props = {
  item: IpWhitelistAddress,
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  editIp: (options: MutationOptions) => MutationResult<IpWhitelistEditResponse>,
  onCloseModal: () => void,
};

const validate = createValidator({ ip: ['required', 'IP'] }, {
  ip: 'IP_WHITELIST.MODALS.ADD_IP_MODAL.IP_ADDRESS',
}, false);

const WhiteListUpdateDescriptionModal = ({ item, isOpen, notify, onSuccess, editIp, onCloseModal }: Props) => {
  const handleSubmit = async ({ description, uuid }: IpWhitelistAddress) => {
    try {
      await editIp({ variables: { description, uuid } });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.NOTIFICATIONS.IP_UPDATED'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('IP_WHITELIST.MODALS.UPDATE_DESCRIPTION_MODAL.NOTIFICATIONS.IP_NOT_UPDATED'),
      });
    }
  };

  return (
    <Modal className="WhiteListUpdateDescriptionModal" toggle={onCloseModal} isOpen={isOpen}>
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
                commonOutline
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


export default compose(
  React.memo,
  withNotifications,
  withRequests({
    editIp: IpWhitelistEditMutation,
  }),
)(WhiteListUpdateDescriptionModal);
