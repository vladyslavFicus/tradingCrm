import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import { TrashButton, Button } from 'components/Buttons';
import PermissionContent from 'components/PermissionContent';
import { Table, Column } from 'components/Table';
import EmailTemplatesQuery from './graphql/EmailTemplatesQuery';
import EmailTemplateDeleteMutation from './graphql/EmailTemplateDeleteMutation';
import './EmailTemplatesList.scss';

class EmailTemplatesList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    error: PropTypes.bool,
    emailTemplatesQuery: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: false,
  };

  handleTemplateClick = (id) => {
    this.props.history.push(`/email-templates/edit/${id}`);
  };

  triggerCreateEmailTemplateModal = () => {
    this.props.history.push('/email-templates/create');
  };

  renderTemplate = ({ id, name }) => (
    <div
      className="EmailTemplatesList__general EmailTemplatesList__general--pointer"
      onClick={() => this.handleTemplateClick(id)}
    >
      {name}
    </div>
  );

  renderSubject = ({ subject }) => <div className="EmailTemplatesList__general">{subject}</div>;

  renderRemoveIcon = ({ id }) => <TrashButton onClick={() => this.handleDeleteTemplateClick(id)} />;

  handleDeleteTemplateClick = async (id) => {
    const { emailTemplatesQuery, emailTemplateDeleteMutation } = this.props;

    try {
      await emailTemplateDeleteMutation({ variables: { id } });

      emailTemplatesQuery.refetch();

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

  render() {
    const { error, emailTemplatesQuery } = this.props;

    const entities = get(emailTemplatesQuery, 'data.emailTemplates') || [];

    return (
      <div className="EmailTemplatesList">
        <div className="EmailTemplatesList__header">
          <span className="EmailTemplatesList__header-title">
            <b>{entities.length}</b> {I18n.t('EMAILS.EMAIL_TEMPLATES.PLACEHOLDER')}
          </span>
          <PermissionContent permissions={permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE}>
            <Button
              className="EmailTemplatesList__header-button"
              onClick={this.triggerCreateEmailTemplateModal}
              disabled={error}
              type="button"
              tertiary
            >
              {I18n.t('EMAILS.EMAIL_TEMPLATES.ADD_TEMPLATE')}
            </Button>
          </PermissionContent>
        </div>

        <Table
          stickyFromTop={126}
          items={entities}
          loading={emailTemplatesQuery.loading}
        >
          <Column
            header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.TEMPLATE')}
            render={this.renderTemplate}
          />
          <Column
            header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.SUBJECT')}
            render={this.renderSubject}
          />
          <Column
            header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.ACTION')}
            render={this.renderRemoveIcon}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withRequests({
    emailTemplateDeleteMutation: EmailTemplateDeleteMutation,
    emailTemplatesQuery: EmailTemplatesQuery,
  }),
)(EmailTemplatesList);
