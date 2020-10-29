import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import MiniProfile from 'components/MiniProfile';
import { notificationCenterSubTypesLabels } from 'constants/notificationCenter';
import './NotificationsGrid.scss';

const prioritiesColor = {
  MEDIUM: 'NotificationsGrid__row-priority-text--medium',
  HIGH: 'NotificationsGrid__row-priority-text--high',
  LOW: 'NotificationsGrid__row-priority-text--low',
};

class NotificationsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notificationCenterQuery: PropTypes.query({
      notificationCenter: PropTypes.pageable(PropTypes.notificationCenter),
    }).isRequired,
  };

  handlePageChanged = () => {
    const { notificationCenterQuery, location } = this.props;

    const currentPage = notificationCenterQuery.data?.notificationCenter?.number || 0;

    const filters = location.state?.filters || {};

    notificationCenterQuery.loadMore({
      args: {
        ...filters,
        hierarchical: true,
        page: {
          from: currentPage + 1,
          size: 20,
        },
      },
    });
  };

  renderNotificationUuid = ({ uuid }) => (
    <Uuid uuid={uuid} className="NotificationsGrid__text-primary" />
  );

  renderNotificationType = ({ type }) => (
    <span className="NotificationsGrid__text-primary">{type}</span>
  );

  renderNotificationTypeDetails = ({ type, details, subtype }) => (
    <Fragment>
      <Choose>
        <When
          condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}
        >
          <span className="NotificationsGrid__text-primary">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
          <div className="NotificationsGrid__text-secondary">{details.amount} {details.currency}</div>
        </When>
        <When condition={type === 'ACCOUNT'}>
          <span className="NotificationsGrid__text-primary">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
          <div className="NotificationsGrid__text-secondary">{details.platformType} - {details.login}</div>
        </When>
        <When condition={type === 'KYC' || type === 'CLIENT'}>
          <span className="NotificationsGrid__text-primary">
            {I18n.t(notificationCenterSubTypesLabels[subtype])}
          </span>
        </When>
        <When condition={type === 'CALLBACK'}>
          <div className="NotificationsGrid__text-primary">
            {I18n.t(`NOTIFICATION_CENTER.DETAILS.${subtype || 'CALLBACK'}`)}
          </div>
          <div className="NotificationsGrid__text-primary">
            {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
              time: moment.utc(details.callbackTime).local().format('HH:mm'),
            })}
          </div>
        </When>
        <When condition={type === 'TRADING' && subtype === 'MARGIN_CALL'}>
          <div className="NotificationsGrid__text-primary">
            {I18n.t('NOTIFICATION_CENTER.SUBTYPES.MARGIN_CALL')}
          </div>
        </When>
      </Choose>
    </Fragment>
  );

  renderAgent = ({ agent }) => (
    <Choose>
      <When condition={agent}>
        <div className="NotificationsGrid__text-primary">
          {agent.fullName}
        </div>
        <div className="NotificationsGrid__text-secondary">
          <MiniProfile id={agent.uuid} type="operator">
            <Uuid uuid={agent.uuid} />
          </MiniProfile>
        </div>
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  );

  renderClient = ({ client }) => {
    const { uuid, fullName, languageCode } = client || {};

    return (
      <Choose>
        <When condition={uuid}>
          <Link
            className="NotificationsGrid__text-primary"
            to={`/clients/${uuid}/profile`}
            target="_blank"
          >
            {fullName}
          </Link>
          <div className="NotificationsGrid__text-secondary">
            <MiniProfile id={uuid} type="player">
              <Uuid uuid={uuid} />
            </MiniProfile>
            <If condition={languageCode}>
              <span> - {languageCode}</span>
            </If>
          </div>
        </When>
        <Otherwise>
          <div>&mdash;</div>
        </Otherwise>
      </Choose>
    );
  };

  renderPriority = ({ priority }) => (
    <div className={classNames(
      prioritiesColor[priority],
      'NotificationsGrid__text-primary text-uppercase',
    )}
    >
      {priority}
    </div>
  );

  renderNotificationDate = ({ createdAt }) => (
    <Fragment>
      <div className="NotificationsGrid__text-primary">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>
      <div className="NotificationsGrid__text-secondary">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  render() {
    const { notificationCenterQuery } = this.props;

    const { content, last } = notificationCenterQuery.data?.notificationCenter || { content: [] };
    const isLoadingNotifications = notificationCenterQuery.loading;

    return (
      <div className="NotificationsGrid">
        <Grid
          data={content}
          isLoading={isLoadingNotifications}
          isLastPage={last}
          withNoResults={!isLoadingNotifications && content.length === 0}
          handlePageChanged={this.handlePageChanged}
          headerStickyFromTop={126}
          rowsClassNames={
            ({ priority }) => classNames({
              'NotificationsGrid__row-color--high': priority === 'HIGH',
              'NotificationsGrid__row-color--medium': priority === 'MEDIUM',
              'NotificationsGrid__row-color--low': priority === 'LOW',
            })
          }
        >
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_ID')}
            render={this.renderNotificationUuid}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
            render={this.renderPriority}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.AGENT')}
            render={this.renderAgent}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
            render={this.renderClient}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
            render={this.renderNotificationDate}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
            render={this.renderNotificationType}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
            render={this.renderNotificationTypeDetails}
          />
        </Grid>
      </div>
    );
  }
}

export default withRouter(NotificationsGrid);
