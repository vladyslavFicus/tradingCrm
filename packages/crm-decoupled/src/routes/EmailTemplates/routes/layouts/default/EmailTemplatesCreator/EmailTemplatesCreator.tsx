import React from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { Button } from 'components';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import Hint from 'components/Hint';
import { validator } from 'routes/EmailTemplates/utils';
import useEmailTemplatesCreator from 'routes/EmailTemplates/routes/hooks/useEmailTemplatesCreator';
import './EmailTemplatesCreator.scss';

const EmailTemplatesCreator = () => {
  const {
    handleSubmit,
    handleBackToList,
  } = useEmailTemplatesCreator();

  return (
    <div className="EmailTemplatesCreator">
      <div className="EmailTemplatesCreator__header">
        <span className="EmailTemplatesCreator__header-title">
          {I18n.t('EMAILS.EMAIL_TEMPLATES.CREATOR.TITLE')}
        </span>

        <Button
          tertiary
          className="EmailTemplatesCreator__header-link"
          data-testid="EmailTemplatesCreator-goToEmailTemplatesButton"
          onClick={handleBackToList}
        >
          {I18n.t('EMAILS.EMAIL_TEMPLATES.LINK_GO_TO_EMAIL_TEMPLATES')}
        </Button>
      </div>

      <div className="EmailTemplatesCreator__body">
        <Formik
          initialValues={{
            name: '',
            subject: '',
            text: '',
          }}
          validate={validator}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ dirty, isValid }) => (
            <Form className="EmailTemplatesCreator__body-form">
              <div className="EmailTemplatesCreator__body-form-editor-container">
                <Field
                  name="text"
                  data-testid="EmailTemplatesCreator-textHtmlEditor"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_LABEL')}
                  placeholder={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_PLACEHOLDER')}
                  component={FormikHtmlEditorField}
                />

                <Hint text={I18n.t('EMAILS.EMAIL_TEMPLATES.HINT')} />
              </div>

              <div className="EmailTemplatesCreator__body-form-fields-container">
                <Field
                  name="name"
                  data-testid="EmailTemplatesCreator-nameInput"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_NAME_LABEL')}
                  component={FormikInputField}
                />

                <Field
                  name="subject"
                  data-testid="EmailTemplatesCreator-subjectInput"
                  label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_SUBJECT_LABEL')}
                  component={FormikInputField}
                />

                <Button
                  className="EmailTemplatesCreator__button"
                  type="submit"
                  primary
                  disabled={!dirty && isValid}
                  data-testid="EmailTemplatesCreator-createButton"
                >
                  {I18n.t('EMAILS.EMAIL_TEMPLATES.CREATOR.BUTTONS.CREATE')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default React.memo(EmailTemplatesCreator);
