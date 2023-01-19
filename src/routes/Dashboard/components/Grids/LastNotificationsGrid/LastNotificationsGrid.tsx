import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GridPlayerInfo from 'components/GridPlayerInfo';
import {
  useLastNotificationsQuery,
  LastNotificationsQuery,
} from './graphql/__generated__/LastNotificationsQuery';
import './LastNotificationsGrid.scss';

type LastNotification = ExtractApolloTypeFromArray<LastNotificationsQuery['dashboard']['lastNotifications']>;

const LastNotificationsGrid = () => {
  const { data, loading } = useLastNotificationsQuery();

  const renderNotificationType = ({ type, uuid }: LastNotification) => (
    <If condition={!!type}>
      <div className="LastNotificationsGrid__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
      </div>

      <Uuid uuid={uuid} className="LastNotificationsGrid__text-secondary" />
    </If>
  );

  const renderNotificationTypeDetails = ({ type, subtype, details }: LastNotification) => (
    <>
      <div className="LastNotificationsGrid__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
      </div>

      <If condition={type === 'CLIENTS_DISTRIBUTOR'}>
        <div>
          <Uuid uuidPrefix="RL" uuid={details.ruleUuid} className="LastNotificationsGrid__text-secondary" />
        </div>
      </If>

      {/* Render custom details for individual type or subtype */}
      <If condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
        <div className="LastNotificationsGrid__text-subtype">{details.amount} {details.currency}</div>
      </If>

      <If condition={type === 'ACCOUNT' || subtype === 'MARGIN_CALL'}>
        <PlatformTypeBadge center position="left" platformType={details.platformType}>
          <div className="LastNotificationsGrid__text-subtype">{details.login}</div>
        </PlatformTypeBadge>
      </If>

      <If condition={type === 'CALLBACK'}>
        <div className="LastNotificationsGrid__text-highlight">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
            time: moment.utc(details.callbackTime).local().format('HH:mm'),
          })}
        </div>
      </If>

      <If condition={subtype === 'BULK_CLIENTS_ASSIGNED'}>
        <div className="LastNotificationsGrid__text-subtype">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details.clientsCount })}
        </div>
      </If>
    </>
  );

  const renderClient = ({ client }: LastNotification) => (
    <GridPlayerInfo profile={client} mainInfoClassName="LastNotificationsGrid__text-highlight" />
  );

  const renderNotificationDate = ({ createdAt }: LastNotification) => {
    if (!createdAt) {
      return null;
    }

    const [date, time] = moment
      .utc(createdAt)
      .local()
      .format('DD.MM.YYYY HH:mm:ss')
      .split(' ');

    return (
      <>
        <div className="LastNotificationsGrid__text-highlight">{date}</div>
        <div className="LastNotificationsGrid__text-secondary">{time}</div>
      </>
    );
  };

  const renderPriority = ({ priority }: LastNotification) => (
    <If condition={!!priority}>
      <div
        className={classNames(
          'LastNotificationsGrid__text-priority',
          `LastNotificationsGrid__text-priority--${priority.toLowerCase()}`,
          'LastNotificationsGrid__text-highlight',
        )}
      >
        {priority.toLowerCase()}
      </div>
    </If>
  );

  const rowsClassNames = ({ priority, read }: LastNotification) => classNames(
    'LastNotificationsGrid__row',
    `LastNotificationsGrid__row--${priority.toLowerCase()}`,
    {
      'LastNotificationsGrid__row--read': read,
    },
  );

  return (
    <div className="LastNotificationsGrid">
      <div className="LastNotificationsGrid__title">
        {I18n.t('DASHBOARD.LATEST_NOTIFICATIONS')}
      </div>

      <Table
        items={data?.dashboard?.lastNotifications || []}
        loading={loading}
        maxSelectCount={20}
        customClassNameRow={rowsClassNames}
      >
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
          render={renderNotificationType}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
          render={renderNotificationTypeDetails}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
          render={renderClient}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
          render={renderNotificationDate}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
          render={renderPriority}
        />
      </Table>
    </div>
  );
};

export default React.memo(LastNotificationsGrid);
