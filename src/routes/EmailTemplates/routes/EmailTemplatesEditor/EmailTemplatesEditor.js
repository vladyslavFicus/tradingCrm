import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import PropTypes from 'constants/propTypes';
import { Button } from 'reactstrap';
import { withRequests } from 'apollo';
import { Field, Form, Formik } from 'formik';
import { withNotifications } from 'hoc';
import { Link } from 'components/Link';
import { FormikInputField, FormikTextEditorField } from 'components/Formik';
import Hint from 'components/Hint';
import EmailTemplateUpdateMutation from './graphql/EmailTemplateUpdateMutation';
import EmailTemplateQuery from './graphql/EmailTemplateQuery';
import { validator } from '../../utils';
import './EmailTemplatesEditor.scss';

class EmailTemplatesEditor extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    emailTemplateQuery: PropTypes.object.isRequired,
    emailTemplateUpdateMutation: PropTypes.func.isRequired,
    ...PropTypes.router,
  };

  static defaultProps = {
    loading: false,
  };

  editTemplate = async (values, { validateForm }) => {
    const {
      emailTemplateUpdateMutation,
      match: { params: { id } },
      history,
      notify,
    } = this.props;

    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const validationErrors = await validateForm({
      ...values,
      text: textWithoutHtml,
    });

    const hasValidationErrors = Object.keys(validationErrors).length > 0;

    if (hasValidationErrors) return;

    try {
      await emailTemplateUpdateMutation({ variables: { ...values, id } });

      history.push('/email-templates/list');

      notify({
        level: 'success',
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ACTIONS.UPDATED'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  render() {
    const {
      emailTemplateQuery,
      loading,
    } = this.props;

    const emailToEdit = get(emailTemplateQuery, 'data.emailTemplate') || null;

    if (loading || !emailToEdit) {
      return null;
    }

    return (
      <div className="EmailTemplatesEditor">
        <div className="EmailTemplatesEditor__header">
          <ReactPlaceholder
            ready={!loading}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="EmailTemplatesEditor__header-title">
              {I18n.t('EMAILS.EMAIL_TEMPLATES.EDITOR.TITLE')}
            </span>
          </ReactPlaceholder>
          <Link to="/email-templates/list" className="EmailTemplatesEditor__header-link">
            {I18n.t('EMAILS.EMAIL_TEMPLATES.LINK_GO_TO_EMAIL_TEMPLATES')}
          </Link>
        </div>
        <div className="EmailTemplatesEditor__body">
          <Formik
            initialValues={{
              subject: emailToEdit ? emailToEdit.subject : '',
              name: emailToEdit ? emailToEdit.name : '',
              text: emailToEdit ? emailToEdit.text : '',
            }}
            enableReinitialize
            validate={validator}
            onSubmit={this.editTemplate}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ dirty, isValid }) => (
              <Form className="EmailTemplatesEditor__body-form">
                <div className="EmailTemplatesEditor__body-form-editor-container">
                  <Field
                    name="text"
                    label={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_LABEL')}
                    placeholder={I18n.t('EMAILS.EMAIL_TEMPLATES.INPUT_EDITOR_PLACEHOLDER')}
                    component={FormikTextEditorField}
                  />
                  <Hint text={I18n.t('EMAILS.EMAIL_TEMPLATES.HINT')} />
                </div>
                <div className="EmailTemplatesEditor__body-form-fields-container">
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
                    {I18n.t('EMAILS.EMAIL_TEMPLATES.EDITOR.BUTTONS.UPDATE')}
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
  emailTemplateUpdateMutation: EmailTemplateUpdateMutation,
  emailTemplateQuery: EmailTemplateQuery,
})(withNotifications(EmailTemplatesEditor));
