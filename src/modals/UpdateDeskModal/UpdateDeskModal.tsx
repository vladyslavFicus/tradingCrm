import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { getAvailableLanguages } from 'config';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import enumToArray from 'utils/enumToArray';
import { createValidator, translateLabels } from 'utils/validator';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Desk__Types__Enum as DeskTypesEnum } from '__generated__/types';
import { useUpdateDeskMutation } from './graphql/__generated__/UpdateDeskMutation';
import './UpdateDeskModal.scss';

const attributeLabels = {
  name: 'MODALS.UPDATE_DESK_MODAL.LABELS.DESK_NAME',
  deskType: 'MODALS.UPDATE_DESK_MODAL.LABELS.DESK_TYPE',
  language: 'MODALS.UPDATE_DESK_MODAL.LABELS.LANGUAGE',
};

type FormValues = {
  uuid: string,
  name: string,
  deskType: DeskTypesEnum,
  language: string,
}

type DataValues = {
  uuid: string,
  name: string,
  deskType: DeskTypesEnum,
  language: string,
}

type Props = {
  data: DataValues,
  isOpen: boolean,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateDeskModal = (props: Props) => {
  const { data, isOpen, onSuccess, onCloseModal } = props;
  const [updateDeskMutation] = useUpdateDeskMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await updateDeskMutation({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_DESK_MODAL.NOTIFICATIONS.SUCCESS'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'name',
          I18n.t('MODALS.UPDATE_DESK_MODAL.ERRORS.UNIQUE'),
        );
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_DESK_MODAL.NOTIFICATIONS.ERROR'),
        });
      }
    }
  };

  return (
    <Modal className="UpdateDeskModal" toggle={onCloseModal} isOpen={isOpen}>
      <Formik
        initialValues={data as FormValues}
        validate={createValidator(
          {
            name: ['required', 'string'],
            deskType: ['required', 'string'],
            language: ['required', `in:${getAvailableLanguages().join()}`],
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
            <ModalHeader toggle={onCloseModal}>{I18n.t('MODALS.UPDATE_DESK_MODAL.HEADER')}</ModalHeader>
            <ModalBody>
              <Field
                name="name"
                className="UpdateDeskModal__field UpdateDeskModal__name"
                label={I18n.t(attributeLabels.name)}
                placeholder={I18n.t(attributeLabels.name)}
                component={FormikInputField}
                disabled={isSubmitting}
              />

              <Field
                name="deskType"
                className="UpdateDeskModal__field UpdateDeskModal__desk-type"
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
                name="language"
                className="UpdateDeskModal__field"
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
                className="UpdateDeskModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="UpdateDeskModal__button"
                primary
                disabled={isSubmitting}
                type="submit"
              >
                {I18n.t('MODALS.UPDATE_DESK_MODAL.UPDATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateDeskModal);
