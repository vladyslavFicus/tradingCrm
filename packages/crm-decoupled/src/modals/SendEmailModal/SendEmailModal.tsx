import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, notify, Types } from '@crm/common';
import { FormikInputField, FormikSingleSelectField, FormikHtmlEditorField } from 'components';
import EmailPreview from 'components/EmailPreview';
import Modal from 'components/Modal';
import { useEmailTemplatesQuery } from './graphql/__generated__/EmailTemplatesQuery';
import { useSendEmailMutation } from './graphql/__generated__/SendEmailMutation';

type TemplateId = string | number;

type FormValues = {
  templateId: TemplateId,
  name: string,
  subject: string,
  text: string,
};

export type Props = {
  uuid: string,
  field: string,
  type: string,
  clientInfo: {
    firstName: string,
    lastName: string,
  },
  onCloseModal: () => void,
};

const SendEmailModal = (props: Props) => {
  const {
    uuid,
    field,
    type,
    clientInfo: {
      firstName,
      lastName,
    },
    onCloseModal,
  } = props;

  // ===== Requests ===== //
  const [sendEmailMutation] = useSendEmailMutation();

  const { data, loading } = useEmailTemplatesQuery();

  const options = data?.emailTemplates || [];
  const optionsWithCustomEmail = [
    {
      id: -1,
      name: 'Custom email',
      subject: '',
      text: '',
    },
    ...options,
  ];

  const handleSubmit = async ({ text, ...restValues }: FormValues) => {
    try {
      await sendEmailMutation({
        variables: {
          uuid,
          field,
          type,
          text: Utils.injectName(firstName, lastName, text),
          ...restValues,
        },
      });

      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  const handleChangeTemplate = (templateId: TemplateId, setValues: Types.SetValues<FormValues>) => {
    const template = optionsWithCustomEmail.find(({ id }) => id === templateId);

    if (template) {
      const { name, subject, text } = template;

      setValues({ templateId, name, subject, text });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Formik
      initialValues={{ templateId: '', subject: '', text: '' } as FormValues}
      onSubmit={handleSubmit}
      validate={Utils.createValidator({
        templateId: 'required',
        subject: 'required|min:2',
        text: 'required|min:20',
      })}
      validateOnChange={false}
    >
      {({ values, setValues, isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('EMAILS.MODALS.EMAIL_SELECT.TITLE')}
          buttonTitle={I18n.t('EMAILS.MODALS.BUTTONS.SEND')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="templateId"
              data-testid="SendEmailModal-templateIdSelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SELECT_LABEL')}
              component={FormikSingleSelectField}
              customOnChange={(value: TemplateId) => handleChangeTemplate(value, setValues)}
              options={optionsWithCustomEmail.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
            />

            <If condition={!!values.templateId}>
              <div>
                <Field
                  name="subject"
                  data-testid="SendEmailModal-subjectInput"
                  label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SUBJECT_LABEL')}
                  disabled={values.templateId !== -1}
                  component={FormikInputField}
                />

                <Choose>
                  <When condition={values.templateId === -1}>
                    <Field
                      name="text"
                      data-testid="SendEmailModal-textHtmlEditor"
                      label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_EDITOR_LABEL')}
                      placeholder={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_EDITOR_PLACEHOLDER')}
                      component={FormikHtmlEditorField}
                    />
                  </When>

                  <Otherwise>
                    <EmailPreview
                      label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.PREVIEW_LABEL')}
                      firstName={firstName}
                      lastName={lastName}
                      text={values.text}
                      templatePreview
                    />
                  </Otherwise>
                </Choose>
              </div>
            </If>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(SendEmailModal);
