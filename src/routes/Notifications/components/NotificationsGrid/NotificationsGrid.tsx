import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { NotificationCenter } from '__generated__/types';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import MiniProfilePopover from 'components/MiniProfilePopover';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import './NotificationsGrid.scss';

type Props = {
  content: Array<NotificationCenter>,
  loading: boolean,
  last: boolean,
  onMore: () => void,
};

const NotificationsGrid = (props: Props) => {
  const { content, loading, last, onMore } = props;

  // ===== Renders ===== //
  const renderNotificationType = ({ uuid, type }: NotificationCenter) => (
    <div>
      <div className="NotificationsGrid__text-primary">{I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}</div>

      <Uuid uuid={uuid} className="NotificationsGrid__text-secondary" />
    </div>
  );

  const renderNotificationTypeDetails = ({ type, details, subtype }: NotificationCenter) => (
    <>
      <div className="NotificationsGrid__text-primary">
        {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
      </div>

      <If condition={type === 'CLIENTS_DISTRIBUTOR'}>
        <div>
          <Uuid uuidPrefix="RL" uuid={details.ruleUuid} className="NotificationsGrid__text-secondary" />
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

      <If condition={subtype === 'PASSWORD_EXPIRATION_NOTIFICATION'}>
        <div className="NotificationsGrid__text-subtype">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.PASSWORD_EXPIRATION', {
            date: moment.utc(details.expirationTime).local().format('DD.MM.YYYY'),
          })}
        </div>
      </If>
    </>
  );

  const renderAgent = ({ agent }: NotificationCenter) => {
    if (!agent) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="NotificationsGrid__text-primary">
          {agent.fullName}
        </div>

        <div className="NotificationsGrid__text-secondary">
          <MiniProfilePopover uuid={agent.uuid} type="operator">
            <Uuid uuid={agent.uuid} />
          </MiniProfilePopover>
        </div>
      </>
    );
  };

  const renderClient = ({ client }: NotificationCenter) => {
    if (!client) {
      return <span>&mdash;</span>;
    }

    const { uuid, fullName, languageCode } = client;

    return (
      <>
        <Link
          className="NotificationsGrid__text-primary"
          to={`/clients/${uuid}/profile`}
          target="_blank"
        >
          {fullName}
        </Link>

        <div className="NotificationsGrid__text-secondary">
          <MiniProfilePopover uuid={uuid} type="client">
            <Uuid uuid={uuid} />
          </MiniProfilePopover>

          <If condition={!!languageCode}>
            <span> - {languageCode}</span>
          </If>
        </div>
      </>
    );
  };

  const renderNotificationDate = ({ createdAt }: NotificationCenter) => (
    <>
      <div className="NotificationsGrid__text-primary">
        {moment.utc(createdAt).local().format('DD.MM.YYYY')}
      </div>

      <div className="NotificationsGrid__text-secondary">
        {moment.utc(createdAt).local().format('HH:mm:ss')}
      </div>
    </>
  );

  const renderPriority = ({ priority }: NotificationCenter) => (
    <div className={classNames(
      `NotificationsGrid-priority-text--${priority.toLowerCase()}`,
      'NotificationsGrid__text-primary text-uppercase',
    )}
    >
      {priority}
    </div>
  );

  const customRowClass = ({ priority }: NotificationCenter) => `NotificationsGrid__row--${priority.toLowerCase()}`;

  return (
    <div className="NotificationsGrid">
      <Table
        stickyFromTop={126}
        items={content}
        onMore={onMore}
        loading={loading}
        hasMore={!last}
        customClassNameRow={customRowClass}
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
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.AGENT')}
          render={renderAgent}
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

export default React.memo(NotificationsGrid);
