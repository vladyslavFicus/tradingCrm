import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { FormikHelpers } from 'formik';
import { notify, LevelType } from '@crm/common';
import { useEmailTemplateCreateMutation } from '../graphql/__generated__/EmailTemplateCreateMutation';

type FormValues = {
  text: string,
  name: string,
  subject: string,
};

type EmailTemplatesCreator = {
  handleSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => void,
  handleBackToList: () => void,
};

const useEmailTemplatesCreator = (): EmailTemplatesCreator => {
  const navigate = useNavigate();

  // ===== Requests ===== //
  const [emailTemplateCreateMutation] = useEmailTemplateCreateMutation();

  // ===== Handlers ===== //
  const handleSubmit = useCallback(async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    const textWithoutHtml = values.text.replace(/<\/?[^>]+(>|$)/g, '');

    const errors = await formikHelpers.validateForm({ ...values, text: textWithoutHtml });

    if (Object.keys(errors).length) {
      return;
    }

    try {
      await emailTemplateCreateMutation({ variables: values });

      navigate('/email-templates/list');

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
  }, []);

  const handleBackToList = useCallback(() => navigate('/email-templates/list'), []);

  return {
    handleSubmit,
    handleBackToList,
  };
};

export default useEmailTemplatesCreator;
