import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import ReactPlaceholder from 'react-placeholder';
import { TextRow } from 'react-placeholder/lib/placeholders';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import PermissionContent from 'components/PermissionContent';
import Grid, { GridColumn } from 'components/Grid';
import EmailTemplatesQuery from './graphql/EmailTemplatesQuery';
import EmailTemplateDeleteMutation from './graphql/EmailTemplateDeleteMutation';
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
    const { emailTemplatesQuery, emailTemplateDeleteMutation, notify } = this.props;

    try {
      await emailTemplateDeleteMutation({ variables: { id } });

      emailTemplatesQuery.refetch();

      notify({
        level: 'success',
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
      });
    } catch {
      notify({
        level: 'error',
        title: I18n.t('COMMON.ACTIONS.DELETE'),
        message: I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY'),
      });
    }
  };

  render() {
    const { loading, error, emailTemplatesQuery } = this.props;

    const entities = get(emailTemplatesQuery, 'data.emailTemplates') || [];

    return (
      <div className="EmailTemplatesList">
        <div className="EmailTemplatesList__header">
          <ReactPlaceholder
            ready={!loading}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
                <TextRow className="animated-background" style={{ width: '220px', height: '12px' }} />
              </div>
            )}
          >
            <span className="EmailTemplatesList__header-title">
              <b>{entities.length}</b> {I18n.t('EMAILS.EMAIL_TEMPLATES.PLACEHOLDER')}
            </span>
          </ReactPlaceholder>
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
          <Grid
            data={entities}
            handleRowClick={this.handleTemplateClick}
            headerStickyFromTop={126}
            isLoading={loading}
            isLastPage
            withNoResults={!loading && entities.length === 0}
          >
            <GridColumn
              name="template"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.TEMPLATE')}
              render={this.renderTemplate}
            />
            <GridColumn
              name="subject"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.SUBJECT')}
              render={this.renderSubject}
            />
            <GridColumn
              name="delete"
              header={I18n.t('EMAILS.EMAIL_TEMPLATES.GRID_HEADER.ACTION')}
              render={this.renderRemoveIcon}
            />
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRequests({
  emailTemplateDeleteMutation: EmailTemplateDeleteMutation,
  emailTemplatesQuery: EmailTemplatesQuery,
})(withNotifications(EmailTemplatesList));
