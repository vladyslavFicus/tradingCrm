import React, { useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Types } from '@crm/common';
import { NotificationCenter } from '__generated__/types';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GetPaymentDetails from 'components/GetPaymentDetails';
import Uuid from 'components/Uuid';
import { Filter, NotificationType, NotificationSubType } from 'components/NotificationCenter/types';
import { MAX_SELECTED_ROWS } from 'components/NotificationCenter/constants';
import useNotificationCenterTable from 'components/NotificationCenter/hooks/useNotificationCenterTable';
import { NotificationQueryQueryResult } from 'components/NotificationCenter/graphql/__generated__/NotificationQuery';
import './NotificationCenterTable.scss';

type Props = {
  notificationQuery: NotificationQueryQueryResult,
  filters: Filter,
  className: string,
  onSetEnableToggle: (enable: boolean) => void,
  onSelect: (select: Types.TableSelection) => void,
};

const NotificationCenterTable = (props: Props) => {
  const { notificationQuery, filters, className, onSetEnableToggle, onSelect } = props;

  const {
    content,
    totalElements,
    last,
    loading,
    handlePageChanged,
    handleSelectError,
  } = useNotificationCenterTable({ notificationQuery, filters, onSetEnableToggle });

  // ===== Renders ===== //
  const renderType = useCallback(({ type, uuid }: NotificationCenter) => (
    <If condition={!!type}>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
      </div>

      <Uuid uuid={uuid} className="NotificationCenterTable__text-secondary" />
    </If>
  ), []);

  const renderDetails = useCallback(({ type, subtype, details }: NotificationCenter) => (
    <>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
      </div>

      <If condition={type === NotificationType.CLIENTS_DISTRIBUTOR}>
        <div>
          <Uuid uuidPrefix="RL" uuid={details.ruleUuid} className="NotificationCenterTable__text-secondary" />
        </div>
      </If>

      {/* Render custom details for individual type or subtype */}
      <If condition={type === NotificationType.WITHDRAWAL || type === NotificationType.DEPOSIT}>
        <div className="NotificationCenterTable__text-subtype">
          <GetPaymentDetails details={details} type={type} />
        </div>
      </If>

      <If condition={type === NotificationType.ACCOUNT || subtype === NotificationSubType.MARGIN_CALL}>
        <PlatformTypeBadge center position="left" platformType={details.platformType}>
          <div className="NotificationCenterTable__text-subtype">{details.login}</div>
        </PlatformTypeBadge>
      </If>

      <If condition={type === NotificationType.CALLBACK}>
        <div className="NotificationCenterTable__text-highlight">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
            time: moment.utc(details.callbackTime).local().format('HH:mm'),
          })}
        </div>
      </If>

      <If condition={subtype === NotificationSubType.BULK_CLIENTS_ASSIGNED}>
        <div className="NotificationCenterTable__text-subtype">
          {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details.clientsCount })}
        </div>
      </If>
    </>
  ), []);

  const renderClient = useCallback(({ client }: NotificationCenter) => {
    if (!client) {
      return null;
    }

    return (
      <GridPlayerInfo profile={client} mainInfoClassName="NotificationCenterTable__text-highlight" />
    );
  }, []);

  const renderDate = useCallback(({ createdAt }: NotificationCenter) => {
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
        <div className="NotificationCenterTable__text-highlight">{date}</div>

        <div className="NotificationCenterTable__text-secondary">{time}</div>
      </>
    );
  }, []);

  const renderPriority = useCallback(({ priority }: NotificationCenter) => (
    <If condition={!!priority}>
      <div
        className={classNames(
          'NotificationCenterTable__text-priority',
          `NotificationCenterTable__text-priority--${priority.toLowerCase()}`,
          'NotificationCenterTable__text-highlight',
        )}
      >
        {priority.toLowerCase()}
      </div>
    </If>
  ), []);

  const rowsClassNames = useCallback(({ priority, read }: NotificationCenter) => classNames(
    'NotificationCenterTable__row',
    `NotificationCenterTable__row--${priority.toLowerCase()}`,
    {
      'NotificationCenterTable__row--read': read,
    },
  ), []);

  return (
    <div
      id="notification-center-table-scrollable-target"
      className={classNames('NotificationCenterTable', className)}
    >
      <Table
        withMultiSelect
        stickyFromTop="0"
        items={content}
        totalCount={totalElements}
        loading={loading}
        hasMore={!last}
        onMore={handlePageChanged}
        maxSelectCount={MAX_SELECTED_ROWS}
        onSelect={onSelect}
        onSelectError={handleSelectError}
        customClassNameRow={rowsClassNames}
        scrollableTarget="notification-center-table-scrollable-target"
      >
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
          render={renderType}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
          render={renderDetails}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
          render={renderClient}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
          render={renderDate}
        />
        <Column
          header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
          render={renderPriority}
        />
      </Table>
    </div>
  );
};

export default React.memo(NotificationCenterTable);
