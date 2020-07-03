import React, { PureComponent, Fragment } from 'react';
import { get, set, cloneDeep } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { notificationCenterSubTypesLabels } from 'constants/notificationCenter';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Uuid from 'components/Uuid';
import './NotificationCenterTable.scss';

class NotificationCenterTable extends PureComponent {
  static propTypes = {
    notifications: PropTypes.query({
      notificationCenter: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.notificationCenter),
        error: PropTypes.any,
      }),
    }).isRequired,
    className: PropTypes.string,
    selectItems: PropTypes.func.isRequired,
    touchedRowsIds: PropTypes.array,
    allRowsSelected: PropTypes.bool,
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

    const page = get(data, 'notificationCenter.number') || 0;

    loadMore(set({ args: cloneDeep(args) }, 'args.page.from', page + 1));
  };

  handleSelectRow = (allRowsSelected, touchedRowsIds) => {
    this.props.selectItems(allRowsSelected, touchedRowsIds);
  };

  handleAllRowsSelect = (allRowsSelected) => {
    this.props.selectItems(allRowsSelected, []);
  };

  rowsClassNames = ({ priority, read }) => classNames(
    'NotificationCenterTable__row',
    `NotificationCenterTable__row--${priority.toLowerCase()}`,
    {
      'NotificationCenterTable__row--read': read,
    },
  );

  renderCallbackDetails = ({ firstName, lastName }, { callbackTime }) => (
    <Fragment>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(notificationCenterSubTypesLabels.CALLBACK_NAME, { name: `${firstName} ${lastName}` })}
      </div>
      <div className="font-size-11">
        {I18n.t(notificationCenterSubTypesLabels.CALLBACK_TIME, {
          time: moment.utc(callbackTime).local().format('HH:mm'),
        })}
      </div>
    </Fragment>
  );

  renderPaymentDetails = (subtype, { amount, currency }) => (
    <Fragment>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(notificationCenterSubTypesLabels[subtype])}
      </div>
      <div className="font-size-11">
        {amount} {currency}
      </div>
    </Fragment>
  );

  renderAccountDetails = (subtype, { platformType, login }) => (
    <Fragment>
      <div className="NotificationCenterTable__text-highlight">
        {I18n.t(notificationCenterSubTypesLabels[subtype])}
      </div>
      <div className="font-size-11">
        {platformType} - {login}
      </div>
    </Fragment>
  );

  render() {
    const {
      className,
      notifications: {
        data,
        loading,
      },
      allRowsSelected,
      touchedRowsIds,
    } = this.props;

    const { content, last } = get(data, 'notificationCenter') || { content: [] };
    const error = get(data, 'notificationCenter.error');

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
          withNoResults={error}
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
            render={({ type, subtype, details, client }) => (
              <If condition={subtype || details}>
                <Choose>
                  <When condition={type === 'CALLBACK'}>
                    {this.renderCallbackDetails(client, details)}
                  </When>
                  <When condition={type === 'WITHDRAWAL' || type === 'DEPOSIT'}>
                    {this.renderPaymentDetails(subtype, details)}
                  </When>
                  <When condition={type === 'ACCOUNT'}>
                    {this.renderAccountDetails(subtype, details)}
                  </When>
                  <Otherwise>
                    <If condition={subtype}>
                      <div className="NotificationCenterTable__text-highlight">
                        {I18n.t(notificationCenterSubTypesLabels[subtype])}
                      </div>
                    </If>
                  </Otherwise>
                </Choose>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('NOTIFICATION_CENTER.GRID_HEADER.CLIENT')}
            render={({ client }) => (
              <If condition={client}>
                <GridPlayerInfo profile={client} mainInfoClassName="NotificationCenterTable__text-highlight" />
              </If>
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

export default NotificationCenterTable;
