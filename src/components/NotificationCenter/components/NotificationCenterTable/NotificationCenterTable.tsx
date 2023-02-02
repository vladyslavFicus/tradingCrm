import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal, TableSelection } from 'types';
import { NotificationCenter } from '__generated__/types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { Filter, NotificationType, NotificationSubType } from '../types';
import { MAX_SELECTED_ROWS } from '../constants';
import { NotificationQueryQueryResult } from '../../graphql/__generated__/NotificationQuery';
import './NotificationCenterTable.scss';

type Props = {
  notificationQuery: NotificationQueryQueryResult,
  filters: Filter,
  className: string,
  modals: {
    confirmationModal: Modal,
  },
  onSetEnableToggle: (enable: boolean) => void,
  onSelect: (select: TableSelection) => void,
};

const NotificationCenterTable = (props: Props) => {
  const { notificationQuery, filters, className, modals, onSetEnableToggle, onSelect } = props;

  const { data, loading, variables, fetchMore } = notificationQuery;
  const size = variables?.args?.page?.size;

  const {
    content = [],
    totalElements = 0,
    number = 0,
    last = true,
  } = data?.notificationCenter || {};

  // ===== Handlers ===== //
  const handlePageChanged = () => {
    if (!loading) {
      fetchMore({
        variables: {
          args: {
            ...filters,
            page: {
              size,
              from: number + 1,
            },
          },
        },
      });
    }
  };

  const handleSelectError = () => {
    onSetEnableToggle(false);

    modals.confirmationModal.show({
      onSubmit: modals.confirmationModal.hide,
      onCloseCallback: () => onSetEnableToggle(true),
      modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
      actionText: I18n.t('NOTIFICATION_CENTER.TOOLTIP.ERRORS.SELECTED_MORE_THAN_MAX', { max: MAX_SELECTED_ROWS }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  };

  // ===== Renders ===== //
  const renderType = ({ type, uuid }: NotificationCenter) => (
    <If condition={!!type}>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
      </div>

      <Uuid uuid={uuid} className="NotificationCenterTable__text-secondary" />
    </If>
  );

  const renderDetails = ({ type, subtype, details }: NotificationCenter) => (
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
        <div className="NotificationCenterTable__text-subtype">{details.amount} {details.currency}</div>
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
  );

  const renderClient = ({ client }: NotificationCenter) => {
    if (!client) {
      return null;
    }

    return (
      <GridPlayerInfo profile={client} mainInfoClassName="NotificationCenterTable__text-highlight" />
    );
  };

  const renderDate = ({ createdAt }: NotificationCenter) => {
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
  };

  const renderPriority = ({ priority }: NotificationCenter) => (
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
  );

  const rowsClassNames = ({ priority, read }: NotificationCenter) => classNames(
    'NotificationCenterTable__row',
    `NotificationCenterTable__row--${priority.toLowerCase()}`,
    {
      'NotificationCenterTable__row--read': read,
    },
  );

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

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(NotificationCenterTable);
