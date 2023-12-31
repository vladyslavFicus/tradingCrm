import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Config, Utils, parseErrors, notify, Types } from '@crm/common';
import { Desk__Types__Enum as DeskTypesEnum, HierarchyBranch } from '__generated__/types';
import { FormikInputField, FormikSingleSelectField } from 'components';
import Modal from 'components/Modal';

import { useUpdateDeskMutation } from './graphql/__generated__/UpdateDeskMutation';
import { attributeLabels } from './constants';
import './UpdateDeskModal.scss';

type FormValues = {
  uuid: string,
  name: string,
  deskType: DeskTypesEnum,
  language: string,
};

export type Props = {
  data: HierarchyBranch,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateDeskModal = (props: Props) => {
  const { data, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateDeskMutation] = useUpdateDeskMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await updateDeskMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_DESK_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.UPDATE_DESK_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_DESK_MODAL.NOTIFICATIONS.ERROR'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={data as FormValues}
      validate={Utils.createValidator(
        {
          name: ['required', 'string'],
          deskType: ['required', 'string'],
          language: ['required', `in:${Config.getAvailableLanguages().join()}`],
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
          title={I18n.t('MODALS.UPDATE_DESK_MODAL.HEADER')}
          buttonTitle={I18n.t('MODALS.UPDATE_DESK_MODAL.UPDATE_BUTTON')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="name"
              className="UpdateDeskModal__field UpdateDeskModal__name"
              data-testid="UpdateDeskModal-nameInput"
              label={I18n.t(attributeLabels.name)}
              placeholder={I18n.t(attributeLabels.name)}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="deskType"
              className="UpdateDeskModal__field UpdateDeskModal__desk-type"
              data-testid="UpdateDeskModal-deskTypeSelect"
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
              name="language"
              className="UpdateDeskModal__field"
              data-testid="UpdateDeskModal-languageSelect"
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

export default React.memo(UpdateDeskModal);
