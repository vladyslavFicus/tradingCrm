import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { TrashButton, Button } from 'components';
import { Email } from '__generated__/types';
import { Table, Column } from 'components/Table';
import useEmailTemplatesList from 'routes/EmailTemplates/routes/hooks/useEmailTemplatesList';
import './EmailTemplatesList.scss';

const EmailTemplatesList = () => {
  const {
    allowCreateTemplate,
    loading,
    entities,
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
  } = useEmailTemplatesList();

  // ===== Renders ===== //
  const renderTemplate = useCallback(({ id, name }: Email) => (
    <div
      className="EmailTemplatesList__general EmailTemplatesList__general--pointer"
      onClick={() => handleEditTemplate(id)}
    >
      {name}
    </div>
  ), []);

  const renderSubject = useCallback(
    ({ subject }: Email) => <div className="EmailTemplatesList__general">{subject}</div>, [],
  );

  const renderActions = useCallback(
    ({ id }: Email) => <TrashButton onClick={() => handleDeleteTemplate(id)} />, [],
  );

  return (
    <div className="EmailTemplatesList">
      <div className="EmailTemplatesList__header">
        <span className="EmailTemplatesList__header-title">
          <b>{entities?.length}</b> {I18n.t('EMAILS.EMAIL_TEMPLATES.PLACEHOLDER')}
        </span>

        <If condition={allowCreateTemplate}>
          <Button
            className="EmailTemplatesList__header-button"
            data-testid="EmailTemplatesList-addTemplateButton"
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
