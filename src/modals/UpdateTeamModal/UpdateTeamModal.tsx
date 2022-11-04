import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Form, Field, Formik, FormikHelpers } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Notify, LevelType } from 'types/notify';
import { Button } from 'components/UI';
import { useUpdateTeamMutation } from './graphql/__generated__/UpdateTeamMutation';
import './UpdateTeamModal.scss';

const attributeLabels = {
  teamName: 'MODALS.UPDATE_TEAM_MODAL.LABELS.TEAM_NAME',
};

type FormValues = {
  uuid: string,
  name: string,
}

type DataValues = {
  uuid: string,
  name: string,
}

type Props = {
  data: DataValues,
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTeamModal = (props: Props) => {
  const { data, isOpen, notify, onSuccess, onCloseModal } = props;
  const [updateTeamMutation] = useUpdateTeamMutation();

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await updateTeamMutation({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TEAM_MODAL.NOTIFICATIONS.SUCCESS'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'name',
          I18n.t('MODALS.UPDATE_TEAM_MODAL.ERRORS.UNIQUE'),
        );
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_TEAM_MODAL.NOTIFICATIONS.ERROR'),
        });
      }
    }
  };

  return (
    <Modal className="UpdateTeamModal" toggle={onCloseModal} isOpen={isOpen}>
      <Formik
        initialValues={data as FormValues}
        validate={createValidator(
          {
            name: ['required', 'string'],
          },
          translateLabels(attributeLabels),
          false,
        )}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.UPDATE_TEAM_MODAL.HEADER')}</ModalHeader>
            <ModalBody>
              <Field
                name="name"
                label={I18n.t(attributeLabels.teamName)}
                placeholder={I18n.t('MODALS.UPDATE_TEAM_MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
                component={FormikInputField}
                disabled={isSubmitting}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="UpdateTeamModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="UpdateTeamModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('MODALS.UPDATE_TEAM_MODAL.UPDATE_BUTTON')}
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
)(UpdateTeamModal);
