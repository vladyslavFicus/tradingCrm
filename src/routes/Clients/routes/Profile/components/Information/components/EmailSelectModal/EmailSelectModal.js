import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { Formik, Form, Field } from 'formik';
import { FormikInputField, FormikSelectField, FormikTextEditorField } from 'components/Formik';
import { createValidator } from 'utils/validator';
import EmailPreview from 'components/EmailPreview';
import { get } from 'lodash';
import { injectName } from 'utils/injectName';
import EmailTemplatesQuery from './graphql/EmailTemplatesQuery';
import EmailSendMutation from './graphql/EmailSendMutation';
import './EmailSelectModalStyles.scss';

const validator = createValidator({
  subject: 'required|min:2',
  text: 'required|min:20',
});

class EmailSelectModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    clientInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    emailTemplatesData: PropTypes.shape({
      loading: PropTypes.bool,
      data: PropTypes.shape({
        emailTemplates: PropTypes.arrayOf(PropTypes.email),
      }),
    }).isRequired,
    emailSendMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  sendEmail = async ({ text, ...restValues }) => {
    const {
      clientInfo: { email, firstName, lastName },
      emailSendMutation,
      onCloseModal,
      notify,
    } = this.props;

    try {
      await emailSendMutation({
        variables: {
          email,
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

  onChangeNameField = (value, setValues, options) => {
    const { subject, text } = options.find(({ name }) => name === value);

    setValues(
      {
        subject,
        text,
        name: value,
      },
      false,
    );
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

    const options = get(data, 'emailTemplates') || [];
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
            name: '',
            subject: '',
            text: '',
          }}
          onSubmit={values => this.sendEmail(values)}
          validate={validator}
          validateOnChange={false}
        >
          {({ values, setValues }) => (
            <Form>
              <ModalBody>
                <Field
                  name="name"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SELECT_LABEL')}
                  component={FormikSelectField}
                  customOnChange={value => this.onChangeNameField(value, setValues, optionsWithCustomEmail)}
                >
                  {optionsWithCustomEmail.map(({ id, name }) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </Field>
                <If condition={values.name}>
                  <div>
                    <Field
                      name="subject"
                      label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SUBJECT_LABEL')}
                      disabled={values.name !== 'Custom email'}
                      component={FormikInputField}
                    />
                    <Choose>
                      <When condition={values.name === 'Custom email'}>
                        <Field
                          name="text"
                          label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_EDITOR_LABEL')}
                          placeholder={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_EDITOR_PLACEHOLDER')}
                          component={FormikTextEditorField}
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
                <Button onClick={onCloseModal}>{I18n.t('COMMON.BUTTONS.CANCEL')}</Button>
                <Button type="submit" color="primary">
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

export default withRequests({
  emailTemplatesData: EmailTemplatesQuery,
  emailSendMutation: EmailSendMutation,
})(withNotifications(EmailSelectModal));
