import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { notify, LevelType } from '@crm/common';
import { EmailTemplateQuery, useEmailTemplateQuery } from '../graphql/__generated__/EmailTemplateQuery';
import { useEmailTemplateUpdateMutation } from '../graphql/__generated__/EmailTemplateUpdateMutation';

type EmailTemplate = EmailTemplateQuery['emailTemplate'];

type FormValues = {
  text: string,
  name: string,
  subject: string,
};

type EmailTemplatesEditor = {
  loading: boolean,
  template?: EmailTemplate,
  handleSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => void,
  handleBackToList: () => void,
};

const useEmailTemplatesEditor = (): EmailTemplatesEditor => {
  const navigate = useNavigate();

  const id = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading } = useEmailTemplateQuery({
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  const template = data?.emailTemplate;

  const [emailTemplateUpdateMutation] = useEmailTemplateUpdateMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const errors = await formikHelpers.validateForm({ ...values, text: textWithoutHtml });

    if (Object.keys(errors).length) {
      return;
    }

    try {
      await emailTemplateUpdateMutation({ variables: { ...values, id } });

      navigate('/email-templates/list');

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
  }, [id]);

  const handleBackToList = useCallback(() => navigate('/email-templates/list'), []);

  return {
    loading,
    template,
    handleSubmit,
    handleBackToList,
  };
};

export default useEmailTemplatesEditor;
