import React, { PureComponent, Fragment } from 'react';
import { set, cloneDeep } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { NetworkStatus } from '@apollo/client';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { MAX_SELECTED_ROWS } from '../../constants';
import './NotificationCenterTable.scss';

class NotificationCenterTable extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    notifications: PropTypes.query({
      notificationCenter: PropTypes.pageable(PropTypes.notificationCenter),
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: null,
  };

  handlePageChanged = () => {
    const {
      notifications: {
        data,
        fetchMore,
        variables: { args },
      },
    } = this.props;

    const page = data?.notificationCenter?.number || 0;

    fetchMore({
      variables: set({ args: cloneDeep(args) }, 'args.page.from', page + 1),
    });
  };

  handleSelectError = (select) => {
    const {
      modals: { confirmationModal },
    } = this.props;

    confirmationModal.show({
      onSubmit: confirmationModal.hide,
      modalTitle: `${select.max} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
      actionText: I18n.t('NOTIFICATION_CENTER.TOOLTIP.ERRORS.SELECTED_MORE_THAN_MAX', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  rowsClassNames = ({ priority, read }) => classNames(
    'NotificationCenterTable__row',
    `NotificationCenterTable__row--${priority.toLowerCase()}`,
    {
      'NotificationCenterTable__row--read': read,
    },
  );

  render() {
    const {
      className,
      notifications: {
        data,
        networkStatus,
      },
      onSelect,
    } = this.props;

    const {
      content = [],
      totalElements = 0,
      last = true,
    } = data?.notificationCenter || {};

    // Show loader only if initial load or new variables was applied
    const loading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus);

    return (
      <div
        id="notification-center-table-scrollable-target"
        className={classNames('NotificationCenterTable', className)}
      >
        <Table
          withMultiSelect
          stickyFromTop={0}
          items={content}
          totalCount={totalElements}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
          maxSelectCount={MAX_SELECTED_ROWS}
          onSelect={onSelect}
          onSelectError={this.handleSelectError}
          customClassNameRow={this.rowsClassNames}
          scrollableTarget="notification-center-table-scrollable-target"
        >
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
            render={({ type, uuid }) => (
              <If condition={type}>
                <div>
                  <div className="NotificationCenterTable__text-highlight">
                    {I18n.t(`NOTIFICATION_CENTER.TYPES.${type}`)}
                  </div>
                </div>
                <Uuid uuid={uuid} className="NotificationCenterTable__text-secondary" />
              </If>
            )}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
            render={({ type, subtype, details }) => (
              <Fragment>
                <div className="NotificationCenterTable__text-highlight">
                  {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
                </div>

                <If condition={type === 'CLIENTS_DISTRIBUTOR'}>
                  <div>
                    <Uuid uuidPrefix="RL" uuid={details.ruleUuid} className="NotificationCenterTable__text-secondary" />
                  </div>
                </If>

                {/* Render custom details for individual type or subtype */}
                <If condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
                  <div className="NotificationCenterTable__text-subtype">{details.amount} {details.currency}</div>
                </If>

                <If condition={type === 'ACCOUNT' || subtype === 'MARGIN_CALL'}>
                  <PlatformTypeBadge center position="left" platformType={details.platformType}>
                    <div className="NotificationCenterTable__text-subtype">{details.login}</div>
                  </PlatformTypeBadge>
                </If>

                <If condition={type === 'CALLBACK'}>
                  <div className="NotificationCenterTable__text-highlight">
                    {I18n.t('NOTIFICATION_CENTER.DETAILS.CALLBACK_TIME', {
                      time: moment.utc(details.callbackTime).local().format('HH:mm'),
                    })}
                  </div>
                </If>

                <If condition={subtype === 'BULK_CLIENTS_ASSIGNED'}>
                  <div className="NotificationCenterTable__text-subtype">
                    {I18n.t('NOTIFICATION_CENTER.DETAILS.CLIENTS_COUNT', { clientsCount: details.clientsCount })}
                  </div>
                </If>
              </Fragment>
            )}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
            render={({ client }) => (
              <GridPlayerInfo profile={client} mainInfoClassName="NotificationCenterTable__text-highlight" />
            )}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_DATE')}
            render={({ createdAt }) => {
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
                  <div className="NotificationCenterTable__text-highlight">{date}</div>
                  <div className="NotificationCenterTable__text-secondary">{time}</div>
                </Fragment>
              );
            }}
          />
          <Column
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.PRIORITY')}
            render={({ priority }) => (
              <If condition={priority}>
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
            )}
          />
        </Table>
      </div>
    );
  }
}

export default withModals({
  confirmationModal: ConfirmActionModal,
})(NotificationCenterTable);
