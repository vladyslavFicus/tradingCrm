import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import { Button } from 'components';
import Hint from 'components/Hint';
import { validator } from 'routes/EmailTemplates/utils';
import useEmailTemplatesEditor from 'routes/EmailTemplates/routes/hooks/useEmailTemplatesEditor';
import './EmailTemplatesEditor.scss';

const EmailTemplatesEditor = () => {
  const {
    loading,
    template,
    handleSubmit,
    handleBackToList,
  } = useEmailTemplatesEditor();

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
