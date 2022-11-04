import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { getAvailableLanguages } from 'config';
import enumToArray from 'utils/enumToArray';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
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
  language: string
}

type Props = {
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateDeskModal = (props: Props) => {
  const { isOpen, notify, onSuccess, onCloseModal } = props;
  const [createDeskMutation] = useCreateDeskMutation();
  const officesQuery = useOfficesQuery();
  const offices = officesQuery.data?.userBranches?.OFFICE || [];

  // ===== Handlers ===== //
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await createDeskMutation({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('MODALS.ADD_DESK_MODAL.NOTIFICATIONS.SUCCESS'),
        message: I18n.t('COMMON.SUCCESS'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'name',
          I18n.t('MODALS.ADD_DESK_MODAL.ERRORS.UNIQUE'),
        );
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
    <Modal className="CreateDeskModal" toggle={onCloseModal} isOpen={isOpen}>
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
            <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.ADD_DESK_MODAL.HEADER')}</ModalHeader>
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

export default compose(
  React.memo,
  withNotifications,
)(CreateDeskModal);
