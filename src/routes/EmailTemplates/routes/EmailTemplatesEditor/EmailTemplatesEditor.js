import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { get } from 'lodash';
import { Field, Form, Formik } from 'formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField, FormikHtmlEditorField } from 'components/Formik';
import Hint from 'components/Hint';
import { validator } from '../../utils';
import EmailTemplateUpdateMutation from './graphql/EmailTemplateUpdateMutation';
import EmailTemplateQuery from './graphql/EmailTemplateQuery';
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

  handleGoToEmailTemplatesClick = () => {
    this.props.history.push('/email-templates/list');
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
          <span className="EmailTemplatesEditor__header-title">
            {I18n.t('EMAILS.EMAIL_TEMPLATES.EDITOR.TITLE')}
          </span>
          <Button
            tertiary
            className="EmailTemplatesEditor__header-link"
            onClick={this.handleGoToEmailTemplatesClick}
          >
            {I18n.t('EMAILS.EMAIL_TEMPLATES.LINK_GO_TO_EMAIL_TEMPLATES')}
          </Button>
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
                    component={FormikHtmlEditorField}
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
                  <Button type="submit" primary disabled={!dirty && isValid}>
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

export default compose(
  withRequests({
    emailTemplateUpdateMutation: EmailTemplateUpdateMutation,
    emailTemplateQuery: EmailTemplateQuery,
  }),
)(EmailTemplatesEditor);
