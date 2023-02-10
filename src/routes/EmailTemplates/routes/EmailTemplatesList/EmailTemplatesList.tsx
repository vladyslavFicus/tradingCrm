import React from 'react';
import { useHistory } from 'react-router-dom';
import I18n from 'i18n-js';
import { Email } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { TrashButton, Button } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import { useEmailTemplatesQuery } from './graphql/__generated__/EmailTemplatesQuery';
import { useEmailTemplateDeleteMutation } from './graphql/__generated__/EmailTemplateDeleteMutation';
import './EmailTemplatesList.scss';

const EmailTemplatesList = () => {
  const history = useHistory();

  const permission = usePermission();
  const allowCreateTemplate = permission.allows(permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE);

  // ===== Requests ===== //
  const { data, loading, refetch } = useEmailTemplatesQuery();

  const entities = data?.emailTemplates || [];

  const [emailTemplateDeleteMutation] = useEmailTemplateDeleteMutation();

  // ===== Handlers ===== //
  const handleCreateTemplate = () => history.push('/email-templates/create');

  const handleEditTemplate = (id: string) => history.push(`/email-templates/edit/${id}`);

  const handleDeleteTemplate = async (id: string) => {
    try {
      await emailTemplateDeleteMutation({ variables: { id } });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  // ===== Renders ===== //
  const renderTemplate = ({ id, name }: Email) => (
    <div
      className="EmailTemplatesList__general EmailTemplatesList__general--pointer"
      onClick={() => handleEditTemplate(id)}
    >
      {name}
    </div>
  );

  const renderSubject = ({ subject }: Email) => <div className="EmailTemplatesList__general">{subject}</div>;

  const renderActions = ({ id }: Email) => <TrashButton onClick={() => handleDeleteTemplate(id)} />;

  return (
    <div className="EmailTemplatesList">
      <div className="EmailTemplatesList__header">
        <span className="EmailTemplatesList__header-title">
          <b>{entities.length}</b> {I18n.t('EMAILS.EMAIL_TEMPLATES.PLACEHOLDER')}
        </span>

        <If condition={allowCreateTemplate}>
          <Button
            className="EmailTemplatesList__header-button"
            onClick={handleCreateTemplate}
            type="button"
            tertiary
          >
            {I18n.t('EMAILS.EMAIL_TEMPLATES.ADD_TEMPLATE')}
          </Button>
        </If>
      </div>

      <Table
        stickyFromTop={126}
        items={entities}
        loading={loading}
      >
        <Column
          header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.TEMPLATE')}
          render={renderTemplate}
        />

        <Column
          header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.SUBJECT')}
          render={renderSubject}
        />

        <Column
          header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.ACTION')}
          render={renderActions}
        />
      </Table>
    </div>
  );
};

export default React.memo(EmailTemplatesList);
