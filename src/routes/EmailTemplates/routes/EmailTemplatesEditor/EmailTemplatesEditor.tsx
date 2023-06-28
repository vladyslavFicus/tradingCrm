import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import { Button } from 'components/Buttons';
import Hint from 'components/Hint';
import { validator } from '../../utils';
import { useEmailTemplateQuery } from './graphql/__generated__/EmailTemplateQuery';
import { useEmailTemplateUpdateMutation } from './graphql/__generated__/EmailTemplateUpdateMutation';
import './EmailTemplatesEditor.scss';

type FormValues = {
  text: string,
  name: string,
  subject: string,
};

const EmailTemplatesEditor = () => {
  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading } = useEmailTemplateQuery({
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  const template = data?.emailTemplate;

  const [emailTemplateUpdateMutation] = useEmailTemplateUpdateMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const errors = await formikHelpers.validateForm({ ...values, text: textWithoutHtml });

    if (Object.keys(errors).length) {
      return;
    }

    try {
      await emailTemplateUpdateMutation({ variables: { ...values, id } });

      history.push('/email-templates/list');

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  const handleBackToList = () => history.push('/email-templates/list');

  if (loading || !template) {
    return null;
  }

  return (
    <div className="EmailTemplatesEditor">
      <div className="EmailTemplatesEditor__header">
        <span className="EmailTemplatesEditor__header-title">
          {I18n.t('EMAILS.EMAIL_TEMPLATES.EDITOR.TITLE')}
        </span>

        <Button
          tertiary
          className="EmailTemplatesEditor__header-link"
          data-testid="EmailTemplatesEditor-goToEmailTemplatesButton"
          onClick={handleBackToList}
        >
          {I18n.t('EMAILS.EMAIL_TEMPLATES.LINK_GO_TO_EMAIL_TEMPLATES')}
        </Button>
      </div>

      <div className="EmailTemplatesEditor__body">
        <Formik
          initialValues={{
            subject: template.subject,
            name: template.name,
            text: template.text,
          }}
          enableReinitialize
          validate={validator}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ dirty, isValid }) => (
            <Form className="EmailTemplatesEditor__body-form">
              <div className="EmailTemplatesEditor__body-form-editor-container">
                <Field
                  name="text"
                  data-testid="EmailTemplatesEditor-textHtmlEditor"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_LABEL')}
                  placeholder={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_PLACEHOLDER')}
                  component={FormikHtmlEditorField}
                />

                <Hint text={I18n.t('EMAILS.EMAIL_TEMPLATES.HINT')} />
              </div>

              <div className="EmailTemplatesEditor__body-form-fields-container">
                <Field
                  name="name"
                  data-testid="EmailTemplatesEditor-nameInput"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_NAME_LABEL')}
                  component={FormikInputField}
                />

                <Field
                  name="subject"
                  data-testid="EmailTemplatesEditor-subjectInput"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_SUBJECT_LABEL')}
                  component={FormikInputField}
                />

                <Button
                  type="submit"
                  primary
                  disabled={!dirty && isValid}
                  data-testid="EmailTemplatesEditor-updateButton"
                >
                  {I18n.t('EMAILS.EMAIL_TEMPLATES.EDITOR.BUTTONS.UPDATE')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default React.memo(EmailTemplatesEditor);
