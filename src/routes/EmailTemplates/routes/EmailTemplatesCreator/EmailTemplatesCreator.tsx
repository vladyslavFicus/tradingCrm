import React from 'react';
import { useHistory } from 'react-router-dom';
import I18n from 'i18n-js';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import { Button } from 'components/Buttons';
import Hint from 'components/Hint';
import { validator } from '../../utils';
import { useEmailTemplateCreateMutation } from './graphql/__generated__/EmailTemplateCreateMutation';
import './EmailTemplatesCreator.scss';

type FormValues = {
  text: string,
  name: string,
  subject: string,
};

const EmailTemplatesCreator = () => {
  const history = useHistory();

  // ===== Requests ===== //
  const [emailTemplateCreateMutation] = useEmailTemplateCreateMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const errors = await formikHelpers.validateForm({ ...values, text: textWithoutHtml });

    if (Object.keys(errors).length) {
      return;
    }

    try {
      await emailTemplateCreateMutation({ variables: values });

      history.push('/email-templates/list');

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.ADDED'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.ADDED'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  const handleBackToList = () => history.push('/email-templates/list');

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
