import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Notify, LevelType } from 'types/notify';
import { Button } from 'components/UI';
import { useCreateTeamMutation } from './graphql/__generated__/CreateTeamMutation';
import { useDesksAndOfficesQuery } from './graphql/__generated__/DesksAndOfficesQuery';
import './CreateTeamModal.scss';

const attributeLabels = {
  teamName: 'MODALS.ADD_TEAM_MODAL.LABELS.TEAM_NAME',
  officeUuid: 'MODALS.ADD_TEAM_MODAL.LABELS.OFFICE',
  deskUuid: 'MODALS.ADD_TEAM_MODAL.LABELS.DESK',
};

type FormValues = {
  teamName: string,
  officeUuid: string,
  deskUuid: string,
}

type Props = {
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateTeamModal = (props: Props) => {
  const { isOpen, notify, onSuccess, onCloseModal } = props;
  const [createTeamMutation] = useCreateTeamMutation();
  const desksAndOfficesQuery = useDesksAndOfficesQuery();
  const { loading } = desksAndOfficesQuery;
  const offices = desksAndOfficesQuery.data?.userBranches?.OFFICE || [];
  const desks = desksAndOfficesQuery.data?.userBranches?.DESK || [];

  // ===== Handlers ===== //
  const handleOfficeChange = (
    value: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  ) => {
    setFieldValue('officeUuid', value);

    // Clear desk field while new office chosen
    setFieldValue('deskUuid', '');
  };

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await createTeamMutation({ variables: values });
      onSuccess();
      onCloseModal();
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'teamName',
          I18n.t('MODALS.ADD_TEAM_MODAL.ERRORS.UNIQUE'),
        );
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    }
  };

  return (
    <Modal className="CreateTeamModal" toggle={onCloseModal} isOpen={isOpen}>
      <Formik
        initialValues={{
          teamName: '',
          officeUuid: '',
          deskUuid: '',
        } as FormValues}
        validate={createValidator(
          {
            teamName: ['required', 'string'],
            officeUuid: ['required', 'string'],
            deskUuid: ['required', 'string'],
          },
          translateLabels(attributeLabels),
          false,
        )}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => {
          const { officeUuid } = values;
          const desksByOffice = desks.filter(desk => desk.parentBranch?.uuid === officeUuid);
          const deskPlaceholder = (desksByOffice.length)
            ? 'COMMON.SELECT_OPTION.DEFAULT'
            : 'MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.NO_OFFICE_DESK';

          return (
            <Form>
              <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.ADD_TEAM_MODAL.HEADER')}</ModalHeader>
              <ModalBody>
                <Field
                  name="teamName"
                  label={I18n.t(attributeLabels.teamName)}
                  placeholder={I18n.t('MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <div>
                  <Field
                    name="officeUuid"
                    className="CreateTeamModal__select"
                    label={I18n.t(attributeLabels.officeUuid)}
                    placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_OFFICE')}
                    component={FormikSelectField}
                    customOnChange={(value: string) => handleOfficeChange(value, setFieldValue)}
                    disabled={isSubmitting || loading}
                    searchable
                  >
                    {offices.map(({ name, uuid }) => (
                      <option key={uuid} value={uuid}>{name}</option>
                    ))}
                  </Field>
                  <Field
                    name="deskUuid"
                    className="CreateTeamModal__select"
                    component={FormikSelectField}
                    label={I18n.t(attributeLabels.deskUuid)}
                    placeholder={I18n.t(
                      (officeUuid)
                        ? deskPlaceholder
                        : 'MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.SELECT_OFFICE_FIRST',
                    )}
                    disabled={isSubmitting || !desksByOffice.length}
                  >
                    {desksByOffice.map(({ name, uuid }) => (
                      <option key={uuid} value={uuid}>{name}</option>
                    ))}
                  </Field>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  className="CreateTeamModal__button"
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>

                <Button
                  className="CreateTeamModal__button"
                  primary
                  disabled={isSubmitting}
                  type="submit"
                >
                  {I18n.t('MODALS.ADD_TEAM_MODAL.CREATE_BUTTON')}
                </Button>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(CreateTeamModal);
