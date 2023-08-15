import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField, FormikSingleSelectField } from 'components';
import Modal from 'components/Modal';
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
};

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateTeamModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const desksAndOfficesQuery = useDesksAndOfficesQuery();

  const { loading } = desksAndOfficesQuery;
  const offices = desksAndOfficesQuery.data?.userBranches?.OFFICE || [];
  const desks = desksAndOfficesQuery.data?.userBranches?.DESK || [];

  const [createTeamMutation] = useCreateTeamMutation();

  // ===== Handlers ===== //
  const handleOfficeChange = (value: string, setFieldValue: Types.SetFieldValue<FormValues>) => {
    setFieldValue('officeUuid', value);

    // Clear desk field while new office chosen
    setFieldValue('deskUuid', '');
  };

  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await createTeamMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.SUCCESS.TITLE'),
        message: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.SUCCESS.MESSAGE'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('teamName', I18n.t('MODALS.ADD_TEAM_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('MODALS.ADD_TEAM_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        teamName: '',
        officeUuid: '',
        deskUuid: '',
      } as FormValues}
      validate={Utils.createValidator(
        {
          teamName: ['required', 'string'],
          officeUuid: ['required', 'string'],
          deskUuid: ['required', 'string'],
        },
        Utils.translateLabels(attributeLabels),
        false,
      )}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, setFieldValue, submitForm }) => {
        const { officeUuid } = values;
        const desksByOffice = desks.filter(desk => desk.parentBranch?.uuid === officeUuid);
        const deskPlaceholder = (desksByOffice.length)
          ? 'COMMON.SELECT_OPTION.DEFAULT'
          : 'MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.NO_OFFICE_DESK';

        return (
          <Modal
            onCloseModal={onCloseModal}
            title={I18n.t('MODALS.ADD_TEAM_MODAL.HEADER')}
            disabled={isSubmitting}
            buttonTitle={I18n.t('MODALS.ADD_TEAM_MODAL.CREATE_BUTTON')}
            clickSubmit={submitForm}
          >
            <Form>
              <Field
                name="teamName"
                data-testid="CreateTeamModal-teamNameInput"
                label={I18n.t(attributeLabels.teamName)}
                placeholder={I18n.t('MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <div className="CreateTeamModal__row">
                <Field
                  searchable
                  name="officeUuid"
                  className="CreateTeamModal__select"
                  data-testid="CreateTeamModal-officeUuidSelect"
                  label={I18n.t(attributeLabels.officeUuid)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_OFFICE')}
                  component={FormikSingleSelectField}
                  onChange={(value: string) => handleOfficeChange(value, setFieldValue)}
                  disabled={isSubmitting || loading}
                  options={offices.map(({ name, uuid }) => ({
                    label: name,
                    value: uuid,
                  }))}
                />

                <Field
                  name="deskUuid"
                  className="CreateTeamModal__select"
                  data-testid="CreateTeamModal-deskUuidSelect"
                  component={FormikSingleSelectField}
                  label={I18n.t(attributeLabels.deskUuid)}
                  placeholder={I18n.t(
                    (officeUuid)
                      ? deskPlaceholder
                      : 'MODALS.ADD_TEAM_MODAL.PLACEHOLDERS.SELECT_OFFICE_FIRST',
                  )}
                  disabled={isSubmitting || !desksByOffice.length}
                  options={desksByOffice.map(({ name, uuid }) => ({
                    label: name,
                    value: uuid,
                  }))}
                />
              </div>
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default React.memo(CreateTeamModal);
