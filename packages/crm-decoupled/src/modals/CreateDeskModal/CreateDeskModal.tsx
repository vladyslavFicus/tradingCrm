import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Config, Utils, notify, Types, parseErrors } from '@crm/common';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { FormikInputField, FormikSingleSelectField } from 'components';
import Modal from 'components/Modal';
import { useCreateDeskMutation } from './graphql/__generated__/CreateDeskMutation';
import { useOfficesQuery } from './graphql/__generated__/OfficesQuery';
import './CreateDeskModal.scss';

const attributeLabels = {
  name: 'MODALS.ADD_DESK_MODAL.LABELS.DESK_NAME',
  deskType: 'MODALS.ADD_DESK_MODAL.LABELS.DESK_TYPE',
  officeUuid: 'MODALS.ADD_DESK_MODAL.LABELS.OFFICE_NAME',
  language: 'MODALS.ADD_DESK_MODAL.LABELS.LANGUAGE',
};

type FormValues = {
  name: string,
  deskType: DeskTypesEnum,
  officeUuid: string,
  language: string,
};

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateDeskModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const officesQuery = useOfficesQuery();

  const offices = officesQuery.data?.userBranches?.OFFICE || [];

  const [createDeskMutation] = useCreateDeskMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await createDeskMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_DESK_MODAL.NOTIFICATIONS.SUCCESS'),
        message: I18n.t('COMMON.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.ADD_DESK_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('MODALS.ADD_DESK_MODAL.NOTIFICATIONS.ERROR'),
          message: I18n.t('COMMON.FAIL'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        deskType: DeskTypesEnum.SALES,
        officeUuid: '',
        language: '',
      } as FormValues}
      validate={Utils.createValidator(
        {
          name: ['required', 'string'],
          deskType: ['required', 'string'],
          officeUuid: ['required', 'string'],
          language: ['required', 'string'],
        },
        Utils.translateLabels(attributeLabels),
        false,
      )}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.ADD_DESK_MODAL.HEADER')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
          buttonTitle={I18n.t('MODALS.ADD_DESK_MODAL.CREATE_BUTTON')}
        >
          <Form>
            <Field
              name="name"
              className="CreateDeskModal__field CreateDeskModal__name"
              data-testid="CreateDeskModal-nameInput"
              label={I18n.t(attributeLabels.name)}
              placeholder={I18n.t(attributeLabels.name)}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="deskType"
              className="CreateDeskModal__field CreateDeskModal__desk-type"
              data-testid="CreateDeskModal-deskTypeSelect"
              component={FormikSingleSelectField}
              label={I18n.t(attributeLabels.deskType)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              disabled={isSubmitting}
              options={Utils.enumToArray(DeskTypesEnum).map(deskType => ({
                label: I18n.t(`MODALS.ADD_DESK_MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`),
                value: deskType,
              }))}
            />

            <Field
              name="officeUuid"
              className="CreateDeskModal__field"
              data-testid="CreateDeskModal-officeUuidSelect"
              component={FormikSingleSelectField}
              label={I18n.t(attributeLabels.officeUuid)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              disabled={isSubmitting || offices.length === 0}
              options={offices.map(({ name, uuid }) => ({
                label: name,
                value: uuid,
              }))}
            />

            <Field
              name="language"
              className="CreateDeskModal__field"
              data-testid="CreateDeskModal-languageSelect"
              component={FormikSingleSelectField}
              label={I18n.t(attributeLabels.language)}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              disabled={isSubmitting}
              options={Config.getAvailableLanguages().map((locale: string) => ({
                label: I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() }),
                value: locale,
              }))}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateDeskModal);
