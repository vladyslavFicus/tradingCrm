import React, { PureComponent, Fragment } from 'react';
import { set, cloneDeep } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { NetworkStatus } from 'apollo-client';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { MAX_SELECTED_ROWS } from '../../constants';
import './NotificationCenterTable.scss';

class NotificationCenterTable extends PureComponent {
  static propTypes = {
    notifications: PropTypes.query({
      notificationCenter: PropTypes.pageable(PropTypes.notificationCenter),
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    className: PropTypes.string,
    selectItems: PropTypes.func.isRequired,
    touchedRowsIds: PropTypes.array,
    allRowsSelected: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
    touchedRowsIds: [],
    allRowsSelected: false,
  };

  handlePageChanged = () => {
    const {
      notifications: {
        data,
        loadMore,
        variables: { args },
      },
    } = this.props;

    const page = data?.notificationCenter?.number || 0;

    loadMore(set({ args: cloneDeep(args) }, 'args.page.from', page + 1));
  };

  handleSelectRow = (allRowsSelected, touchedRowsIds) => {
    this.props.selectItems(allRowsSelected, touchedRowsIds);
  };

  handleAllRowsSelect = (allRowsSelected) => {
    const {
      selectItems,
      onCloseModal,
      notifications,
      modals: { confirmationModal },
    } = this.props;

    const { totalElements } = notifications?.data?.notificationCenter || {};

    if (allRowsSelected && totalElements > MAX_SELECTED_ROWS) {
      confirmationModal.show({
        onSubmit: confirmationModal.hide,
        onCloseCallback: onCloseModal(),
        modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
        actionText: I18n.t('NOTIFICATION_CENTER.TOOLTIP.ERRORS.SELECTED_MORE_THAN_MAX', { max: MAX_SELECTED_ROWS }),
        submitButtonLabel: I18n.t('COMMON.OK'),
      });
    }

    selectItems(allRowsSelected, []);
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
      allRowsSelected,
      touchedRowsIds,
    } = this.props;

    const { content, last } = data?.notificationCenter || { content: [] };

    // Show loader only if initial load or new variables was applied
    const loading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus);

    return (
      <div
        className={classNames('NotificationCenterTable', className)}
        ref={(node) => {
          this.scrollParentRef = node;
        }}
      >
        <Grid
          className="NotificationCenterTable__grid"
          data={content}
          touchedRowsIds={touchedRowsIds}
          allRowsSelected={allRowsSelected}
          handlePageChanged={this.handlePageChanged}
          handleSelectRow={this.handleSelectRow}
          handleAllRowsSelect={this.handleAllRowsSelect}
          rowsClassNames={this.rowsClassNames}
          scrollParentRef={this.scrollParentRef}
          isLoading={loading}
          isLastPage={last}
          threshold={0}
          withNoResults={!loading && !content.length}
          withMultiSelect
          useWindow={false}
        >
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE')}
            render={({ type, uuid }) => (
              <If condition={type}>
                <div>
                  <span className="NotificationCenterTable__text-highlight">{type}</span>
                </div>
                <Uuid uuid={uuid} className="font-size-11" />
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.NOTIFICATION_TYPE_DETAILS')}
            render={({ type, subtype, details }) => (
              <Fragment>
                <span className="NotificationCenterTable__text-highlight">
                  {I18n.t(`NOTIFICATION_CENTER.SUBTYPES.${subtype}`)}
                </span>

                {/* Render custom details for individual type or subtype */}
                <If condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
                  <div className="NotificationCenterTable__text-subtype">{details.amount} {details.currency}</div>
                </If>

                <If condition={type === 'ACCOUNT'}>
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
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
            render={({ client }) => (
              <Choose>
                <When condition={client}>
                  <GridPlayerInfo profile={client} mainInfoClassName="NotificationCenterTable__text-highlight" />
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <GridColumn
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
                  <div className="font-size-11">{time}</div>
                </Fragment>
              );
            }}
          />
          <GridColumn
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
        </Grid>
      </div>
    );
  }
}

export default withModals({
  confirmationModal: ConfirmActionModal,
})(NotificationCenterTable);
