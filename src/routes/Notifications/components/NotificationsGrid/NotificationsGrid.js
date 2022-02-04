import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import MiniProfile from 'components/MiniProfile';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
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

    notificationCenterQuery.fetchMore({
      variables: {
        args: {
          ...filters,
          hierarchical: true,
          page: {
            from: currentPage + 1,
            size: 20,
          },
        },
      },
    });
  };

  renderNotificationType = ({ uuid, type }) => (
    <div>
      <div className="NotificationsGrid__text-primary">{I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}</div>
      <Uuid uuid={uuid} className="NotificationsGrid__text-secondary" />
    </div>
  );

  renderNotificationTypeDetails = ({ type, details, subtype }) => (
    <Fragment>
      <div className="NotificationsGrid__text-primary">
        {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
      </div>

      <If condition={type === 'CLIENTS_DISTRIBUTOR'}>
        <div>
          <Uuid uuidPrefix="RL" uuid={details.ruleUuid} className="font-size-11" />
        </div>
      </If>

      {/* Render custom details for individual type or subtype */}
      <If condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
        <div className="NotificationsGrid__text-subtype">
          {I18n.toCurrency(details.amount, { unit: '' })} {details.currency}
        </div>
      </If>

      <If condition={type === 'ACCOUNT' || subtype === 'MARGIN_CALL'}>
        <PlatformTypeBadge center position="left" platformType={details.platformType}>
          <div className="NotificationsGrid__text-subtype">{details.login}</div>
        </PlatformTypeBadge>
      </If>

      <If condition={type === 'CALLBACK'}>
        <div className="NotificationsGrid__text-primary">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
            time: moment.utc(details.callbackTime).local().format('HH:mm'),
          })}
        </div>
      </If>

      <If condition={subtype === 'BULK_CLIENTS_ASSIGNED'}>
        <div className="NotificationsGrid__text-subtype">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details.clientsCount })}
        </div>
      </If>
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

    const { content = [], last = true } = notificationCenterQuery.data?.notificationCenter || {};
    const isLoadingNotifications = notificationCenterQuery.loading;

    return (
      <div className="NotificationsGrid">
        <Table
          stickyFromTop={126}
          items={content}
          onMore={this.handlePageChanged}
          loading={isLoadingNotifications}
          hasMore={!last}
          customClassNameRow={
            ({ priority }) => classNames({
              'NotificationsGrid__row-color--high': priority === 'HIGH',
              'NotificationsGrid__row-color--medium': priority === 'MEDIUM',
              'NotificationsGrid__row-color--low': priority === 'LOW',
            })
          }
        >
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
            render={this.renderNotificationType}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
            render={this.renderNotificationTypeDetails}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.AGENT')}
            render={this.renderAgent}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
            render={this.renderClient}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
            render={this.renderNotificationDate}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
            render={this.renderPriority}
          />
        </Table>
      </div>
    );
  }
}

export default withRouter(NotificationsGrid);
