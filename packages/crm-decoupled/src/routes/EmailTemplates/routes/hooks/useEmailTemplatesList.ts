import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import I18n from 'i18n-js';
import { Config, notify, Types, usePermission } from '@crm/common';
import { EmailTemplatesQuery, useEmailTemplatesQuery } from '../graphql/__generated__/EmailTemplatesQuery';
import { useEmailTemplateDeleteMutation } from '../graphql/__generated__/EmailTemplateDeleteMutation';

type EmailTemplates = EmailTemplatesQuery['emailTemplates'];

type EmailTemplatesList = {
  allowCreateTemplate: boolean,
  loading: boolean,
  entities?: EmailTemplates,
  handleCreateTemplate: () => void,
  handleEditTemplate: (id: string) => void,
  handleDeleteTemplate: (id: string) => void,
};

const useEmailTemplatesList = (): EmailTemplatesList => {
  const navigate = useNavigate();

  const permission = usePermission();
  const allowCreateTemplate = permission.allows(Config.permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE);

  // ===== Requests ===== //
  const { data, loading, refetch } = useEmailTemplatesQuery();

  const entities = data?.emailTemplates || [];

  const [emailTemplateDeleteMutation] = useEmailTemplateDeleteMutation();

  // ===== Handlers ===== //
  const handleCreateTemplate = useCallback(() => navigate('/email-templates/create'), []);

  const handleEditTemplate = useCallback((id: string) => navigate(`/email-templates/${id}`), []);

  const handleDeleteTemplate = useCallback(async (id: string) => {
    try {
      await emailTemplateDeleteMutation({ variables: { id } });

      refetch();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  }, []);

  return {
    allowCreateTemplate,
    loading,
    entities,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
  };
};

export default useEmailTemplatesList;
