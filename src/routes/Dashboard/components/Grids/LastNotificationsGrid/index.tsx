import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import Uuid from 'components/Uuid';
// import permissions from 'config/permissions'; // TODO: Add permission
// import PermissionContent from 'components/PermissionContent'; // TODO: Add permission
import { Table, Column } from 'components/Table';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GridPlayerInfo from 'components/GridPlayerInfo';
import {
  useLastNotificationsQuery,
  LastNotificationsQuery,
} from './graphql/__generated__/LastNotificationsQuery';
import './LastNotificationsGrid.scss';

type LastNotification = ExtractApolloTypeFromArray<LastNotificationsQuery['dashboard']['lastNotification']>;

const LastNotificationsGrid = () => {
  // const isAvailable = new Permissions(...some permission); // TODO: Add permission

  const { data, loading } = useLastNotificationsQuery({
    // skip: !isAvailable TODO: skip by permission
  });

  const renderNotificationType = ({ type, uuid }: LastNotification) => (
    <If condition={!!type}>
      <div className="LastNotificationsGrid__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
      </div>

      <Uuid uuid={uuid} className="LastNotificationsGrid__text-secondary" />
    </If>
  );

  const renderNotificationTypeDetails = ({ type, subtype, details }: LastNotification) => (
    <Fragment>
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
    </Fragment>
  );

  const renderClient = ({ client }: LastNotification) => (
    <Choose>
      <When condition={!!client}>
        <GridPlayerInfo profile={client} mainInfoClassName="LastNotificationsGrid__text-highlight" />
      </When>

      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
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
      <Fragment>
        <div className="LastNotificationsGrid__text-highlight">{date}</div>
        <div className="LastNotificationsGrid__text-secondary">{time}</div>
      </Fragment>
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
    // <PermissionContent permissions={}> // TODO: Add permission
    <div className="LastNotificationsGrid">
      <div className="LastNotificationsGrid__title">
        {I18n.t('DASHBOARD.LATEST_NOTIFICATIONS')}
      </div>

      <Table
        items={data?.dashboard?.lastNotification || []}
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
    // </PermissionContent>
  );
};

export default React.memo(LastNotificationsGrid);
