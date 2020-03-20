import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { withRequests } from 'apollo';
import { Field, Form, Formik } from 'formik';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikTextEditorField } from 'components/Formik';
import Hint from 'components/Hint';
import EmailTemplateCreateMutation from '../graphql/EmailTemplateCreateMutation';
import { validator } from '../../../utils';
import './EmailTemplatesCreator.scss';

class EmailTemplatesCreator extends PureComponent {
  static propTypes = {
    emailTemplateCreateMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    ...PropTypes.router,
  };

  createEmailTemplate = async (values) => {
    const {
      emailTemplateCreateMutation,
      notify,
      history: {
        push,
      },
    } = this.props;

    const {
      data: {
        emailTemplates: {
          createEmailTemplate: { error },
        },
      },
    } = await emailTemplateCreateMutation({ variables: values });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('COMMON.ACTIONS.ADDED'),
      message: error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
    });

    if (!error) {
      push('/email-templates/list');
    }
  };

  render() {
    return (
      <div className="EmailTemplatesCreator">
        <div className="EmailTemplatesCreator__header">
          <span className="EmailTemplatesCreator__header-title">
            {I18n.t('EMAILS.EMAIL_TEMPLATES.CREATOR.TITLE')}
          </span>
          <Link to="/email-templates/list" className="EmailTemplatesCreator__header-link">
            {I18n.t('EMAILS.EMAIL_TEMPLATES.LINK_GO_TO_EMAIL_TEMPLATES')}
          </Link>
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
                    component={FormikTextEditorField}
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
                  <Button type="submit" color="primary" disabled={!dirty && isValid}>
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

export default withRequests({
  emailTemplateCreateMutation: EmailTemplateCreateMutation,
})(withNotifications(EmailTemplatesCreator));
