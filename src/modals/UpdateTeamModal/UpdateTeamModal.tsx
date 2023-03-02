import React from 'react';
import I18n from 'i18n-js';
import { Form, Field, Formik, FormikHelpers } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { parseErrors } from 'apollo';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { useUpdateTeamMutation } from './graphql/__generated__/UpdateTeamMutation';
import './UpdateTeamModal.scss';

const attributeLabels = {
  teamName: 'MODALS.UPDATE_TEAM_MODAL.LABELS.TEAM_NAME',
};

type DataValues = {
  uuid: string,
  name: string,
};

type FormValues = {
  uuid: string,
  name: string,
};

export type Props = {
  data: DataValues,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTeamModal = (props: Props) => {
  const { data, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateTeamMutation] = useUpdateTeamMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await updateTeamMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TEAM_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.UPDATE_TEAM_MODAL.ERRORS.UNIQUE'));
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
    <Modal className="UpdateTeamModal" toggle={onCloseModal} isOpen>
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
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('MODALS.UPDATE_TEAM_MODAL.HEADER')}
            </ModalHeader>

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

export default React.memo(UpdateTeamModal);
