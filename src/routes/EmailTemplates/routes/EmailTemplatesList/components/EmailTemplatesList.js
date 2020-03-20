import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import Placeholder from 'components/Placeholder';
import EmailTemplatesQuery from '../graphql/EmailTemplatesQuery';
import EmailTemplateDeleteMutation from '../graphql/EmailTemplateDeleteMutation';
import './EmailTemplatesList.scss';

class EmailTemplatesList extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    emailTemplatesQuery: PropTypes.object.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loading: false,
    error: false,
  };

  handleTemplateClick = ({ id }) => {
    this.props.history.push(`/email-templates/edit/${id}`);
  };

  triggerCreateEmailTemplateModal = () => {
    this.props.history.push('/email-templates/create');
  };

  renderTemplate = ({ name }) => <div className="font-weight-700 cursor-pointer">{name}</div>;

  renderSubject = ({ subject }) => <div className="font-weight-700 cursor-pointer">{subject}</div>;

  renderRemoveIcon = ({ id }) => (
    <button
      type="button"
      className="fa fa-trash btn-transparent color-danger margin-right-15"
      onClick={(e) => {
        e.stopPropagation();
        this.handleDeleteTemplateClick(id);
      }}
    />
  );

  handleDeleteTemplateClick = async (id) => {
    const { emailTemplateDeleteMutation, notify } = this.props;

    const {
      data: {
        emailTemplates: {
          deleteEmailTemplate: {
            error,
          },
        },
      },
    } = await emailTemplateDeleteMutation({ variables: { id } });

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('COMMON.ACTIONS.DELETE'),
      message: error
        ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY')
        : I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
    });
  };

  render() {
    const { loading, error, emailTemplatesQuery } = this.props;

    const entities = get(emailTemplatesQuery, 'data.emailTemplates.data') || [];

    return (
      <div className="EmailTemplatesList">
        <div className="EmailTemplatesList__header">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="EmailTemplatesList__header-title">
              {entities.length} {I18n.t('EMAILS.EMAIL_TEMPLATES.PLACEHOLDER')}
            </span>
          </Placeholder>
          <PermissionContent permissions={permissions.EMAIL_TEMPLATES.CREATE_EMAIL_TEMPLATE}>
            <button
              className="EmailTemplatesList__header-button"
              onClick={this.triggerCreateEmailTemplateModal}
              disabled={error}
              type="button"
            >
              {I18n.t('EMAILS.EMAIL_TEMPLATES.ADD_TEMPLATE')}
            </button>
          </PermissionContent>
        </div>
        <div className="EmailTemplatesList__body">
          <GridView
            dataSource={entities}
            showNoResults={!loading && entities.length === 0}
            onRowClick={this.handleTemplateClick}
            last
          >
            <GridViewColumn
              name="template"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.TEMPLATE')}
              render={this.renderTemplate}
            />
            <GridViewColumn
              name="subject"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.SUBJECT')}
              render={this.renderSubject}
            />
            <GridViewColumn
              name="delete"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.ACTION')}
              render={this.renderRemoveIcon}
              headerClassName="EmailTemplatesList__body-delete-col"
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default withRequests({
  emailTemplateDeleteMutation: EmailTemplateDeleteMutation,
  emailTemplatesQuery: EmailTemplatesQuery,
})(withNotifications(EmailTemplatesList));
