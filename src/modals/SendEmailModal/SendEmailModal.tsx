import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { SetValues } from 'types/formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator } from 'utils/validator';
import { injectName } from 'utils/injectName';
import { FormikInputField, FormikSelectField, FormikHtmlEditorField } from 'components/Formik';
import EmailPreview from 'components/EmailPreview';
import { Button } from 'components/Buttons';
import { useEmailTemplatesQuery } from './graphql/__generated__/EmailTemplatesQuery';
import { useSendEmailMutation } from './graphql/__generated__/SendEmailMutation';

type TemplateId = string | number;

type FormValues = {
  templateId: TemplateId,
  name: string,
  subject: string,
  text: string,
};

export type Props = {
  uuid: string,
  field: string,
  type: string,
  clientInfo: {
    firstName: string,
    lastName: string,
  },
  onCloseModal: () => void,
};

const SendEmailModal = (props: Props) => {
  const {
    uuid,
    field,
    type,
    clientInfo: {
      firstName,
      lastName,
    },
    onCloseModal,
  } = props;

  // ===== Requests ===== //
  const [sendEmailMutation] = useSendEmailMutation();

  const { data, loading } = useEmailTemplatesQuery();

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

  const handleSubmit = async ({ text, ...restValues }: FormValues) => {
    try {
      await sendEmailMutation({
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
        level: LevelType.SUCCESS,
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('EMAILS.ACTIONS.SEND'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  const handleChangeTemplate = (templateId: TemplateId, setValues: SetValues<FormValues>) => {
    const template = optionsWithCustomEmail.find(({ id }) => id === templateId);

    if (template) {
      const { name, subject, text } = template;

      setValues({ templateId, name, subject, text });
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Modal toggle={onCloseModal} isOpen>
      <ModalHeader toggle={onCloseModal}>
        {I18n.t('EMAILS.MODALS.EMAIL_SELECT.TITLE')}
      </ModalHeader>

      <Formik
        initialValues={{ templateId: '', subject: '', text: '' } as FormValues}
        onSubmit={handleSubmit}
        validate={createValidator({
          templateId: 'required',
          subject: 'required|min:2',
          text: 'required|min:20',
        })}
        validateOnChange={false}
      >
        {({ values, setValues, isSubmitting }) => (
          <Form>
            <ModalBody>
              <Field
                name="templateId"
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                label={I18n.t('EMAILS.MODALS.EMAIL_SELECT.INPUT_SELECT_LABEL')}
                component={FormikSelectField}
                customOnChange={(value: TemplateId) => handleChangeTemplate(value, setValues)}
              >
                {optionsWithCustomEmail.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Field>

              <If condition={!!values.templateId}>
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
                type="submit"
                disabled={isSubmitting}
              >
                {I18n.t('EMAILS.MODALS.BUTTONS.SEND')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(SendEmailModal);