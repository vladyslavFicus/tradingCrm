import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { getAvailableLanguages } from 'config';
import enumToArray from 'utils/enumToArray';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
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
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_DESK_MODAL.NOTIFICATIONS.SUCCESS'),
        message: I18n.t('COMMON.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.ADD_DESK_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('MODALS.ADD_DESK_MODAL.NOTIFICATIONS.ERROR'),
          message: I18n.t('COMMON.FAIL'),
        });
      }
    }
  };

  return (
    <Modal className="CreateDeskModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          name: '',
          deskType: DeskTypesEnum.SALES,
          officeUuid: '',
          language: '',
        } as FormValues}
        validate={createValidator(
          {
            name: ['required', 'string'],
            deskType: ['required', 'string'],
            officeUuid: ['required', 'string'],
            language: ['required', 'string'],
          },
          translateLabels(attributeLabels),
          false,
        )}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('MODALS.ADD_DESK_MODAL.HEADER')}
            </ModalHeader>

            <ModalBody>
              <Field
                name="name"
                className="CreateDeskModal__field CreateDeskModal__name"
                label={I18n.t(attributeLabels.name)}
                placeholder={I18n.t(attributeLabels.name)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="deskType"
                className="CreateDeskModal__field CreateDeskModal__desk-type"
                component={FormikSelectField}
                label={I18n.t(attributeLabels.deskType)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled={isSubmitting}
              >
                {enumToArray(DeskTypesEnum).map(deskType => (
                  <option key={deskType} value={deskType}>
                    {I18n.t(`MODALS.ADD_DESK_MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
                  </option>
                ))}
              </Field>

              <Field
                name="officeUuid"
                className="CreateDeskModal__field"
                component={FormikSelectField}
                label={I18n.t(attributeLabels.officeUuid)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled={isSubmitting || offices.length === 0}
              >
                {offices.map(({ name, uuid }) => (
                  <option key={uuid} value={uuid}>{name}</option>
                ))}
              </Field>

              <Field
                name="language"
                className="CreateDeskModal__field"
                component={FormikSelectField}
                label={I18n.t(attributeLabels.language)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled={isSubmitting}
              >
                {getAvailableLanguages().map((locale: string) => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="CreateDeskModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="CreateDeskModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('MODALS.ADD_DESK_MODAL.CREATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(CreateDeskModal);
