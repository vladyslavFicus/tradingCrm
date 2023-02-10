import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Field, Form, Formik } from 'formik';
import { Button } from 'components/Buttons';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import Hint from 'components/Hint';
import { validator } from '../../utils';
import EmailTemplateCreateMutation from './graphql/EmailTemplateCreateMutation';
import './EmailTemplatesCreator.scss';

class EmailTemplatesCreator extends PureComponent {
  static propTypes = {
    emailTemplateCreateMutation: PropTypes.func.isRequired,
    ...PropTypes.router,
  };

  createEmailTemplate = async (values, { validateForm }) => {
    const {
      emailTemplateCreateMutation,
      history,
    } = this.props;

    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const validationErrors = await validateForm({
      ...values,
      text: textWithoutHtml,
    });

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    if (hasValidationErrors) return;

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

  handleGoToEmailTemplatesClick = () => {
    this.props.history.push('/email-templates/list');
  };

  render() {
    return (
      <div className="EmailTemplatesCreator">
        <div className="EmailTemplatesCreator__header">
          <span className="EmailTemplatesCreator__header-title">
            {I18n.t('EMAILS.EMAIL_TEMPLATES.CREATOR.TITLE')}
          </span>
          <Button
            tertiary
            className="EmailTemplatesCreator__header-link"
            onClick={this.handleGoToEmailTemplatesClick}
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
            onSubmit={this.createEmailTemplate}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ dirty, isValid }) => (
              <Form className="EmailTemplatesCreator__body-form">
                <div className="EmailTemplatesCreator__body-form-editor-container">
                  <Field
                    name="text"
                    label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_LABEL')}
                    placeholder={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_PLACEHOLDER')}
                    component={FormikHtmlEditorField}
                  />
                  <Hint text={I18n.t('EMAILS.EMAIL_TEMPLATES.HINT')} />
                </div>
                <div className="EmailTemplatesCreator__body-form-fields-container">
                  <Field
                    name="name"
                    label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_NAME_LABEL')}
                    component={FormikInputField}
                  />
                  <Field
                    name="subject"
                    label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_SUBJECT_LABEL')}
                    component={FormikInputField}
                  />
                  <Button type="submit" primary disabled={!dirty && isValid}>
                    {I18n.t('EMAILS.EMAIL_TEMPLATES.CREATOR.BUTTONS.CREATE')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default compose(
  withRequests({
    emailTemplateCreateMutation: EmailTemplateCreateMutation,
  }),
)(EmailTemplatesCreator);
