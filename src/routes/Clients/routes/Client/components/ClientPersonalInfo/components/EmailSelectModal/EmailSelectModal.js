import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { injectName } from 'utils/injectName';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField, FormikHtmlEditorField } from 'components/Formik';
import EmailPreview from 'components/EmailPreview';
import { Button } from 'components/UI';
import EmailTemplatesQuery from './graphql/EmailTemplatesQuery';
import EmailSendMutation from './graphql/EmailSendMutation';
import '../../ClientPersonalInfo.scss';

class EmailSelectModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['PROFILE', 'LEAD']).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    clientInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }).isRequired,
    emailTemplatesData: PropTypes.query({
      emailTemplates: PropTypes.arrayOf(PropTypes.email),
    }).isRequired,
    emailSendMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  sendEmail = async ({ text, ...restValues }) => {
    const {
      uuid,
      field,
      type,
      clientInfo: { firstName, lastName },
      emailSendMutation,
      onCloseModal,
      notify,
    } = this.props;

    try {
      await emailSendMutation({
        variables: {
          uuid,
          field,
          type,
          text: injectName(firstName, lastName, text),
          ...restValues,
        },
      });

      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  onChangeNameField = (templateId, setValues, options) => {
    const { subject, text } = options.find(({ id }) => id === templateId);

    setValues({
      templateId,
      subject,
      text,
    });
  };

  render() {
    const {
      clientInfo: { firstName, lastName },
      emailTemplatesData: { data, loading },
      onCloseModal,
      isOpen,
    } = this.props;

    if (loading) {
      return null;
    }

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

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('EMAILS.MODALS.EMAIL_SELECT.TITLE')}</ModalHeader>
        <Formik
          initialValues={{
            templateId: '',
            subject: '',
            text: '',
          }}
          onSubmit={this.sendEmail}
          validate={createValidator({
            templateId: 'required',
            subject: 'required|min:2',
            text: 'required|min:20',
          })}
          validateOnChange={false}
        >
          {({ values, setValues, handleSubmit }) => (
            <Form>
              <ModalBody>
                <Field
                  name="templateId"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SELECT_LABEL')}
                  component={FormikSelectField}
                  customOnChange={value => this.onChangeNameField(value, setValues, optionsWithCustomEmail)}
                >
                  {optionsWithCustomEmail.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Field>
                <If condition={values.templateId}>
                  <div>
                    <Field
                      name="subject"
                      label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SUBJECT_LABEL')}
                      disabled={values.templateId !== -1}
                      component={FormikInputField}
                    />
                    <Choose>
                      <When condition={values.templateId === -1}>
                        <Field
                          name="text"
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
              </ModalBody>
              <ModalFooter>
                <Button
                  tertiary
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  onClick={handleSubmit}
                >
                  {I18n.t('EMAILS.MODALS.BUTTONS.SEND')}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
}
export default compose(
  withNotifications,
  withRequests({
    emailTemplatesData: EmailTemplatesQuery,
    emailSendMutation: EmailSendMutation,
  }),
)(EmailSelectModal);
