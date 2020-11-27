import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import ReactSwitch from 'components/ReactSwitch';
import { MAX_SELECTED_ROWS } from '../../constants';
import NotificationCenterForm from '../NotificationCenterForm';
import NotificationCenterTable from '../NotificationCenterTable';
import NotificationCenterQuery from '../../graphql/NotificationCenterQuery';
import NotificationCenterTypesQuery from '../../graphql/NotificationCenterTypesQuery';
import NotificationCenterConfigurationQuery from '../../graphql/NotificationCenterConfigurationQuery';
import NotificationCenterUpdate from '../../graphql/NotificationCenterUpdate';
import NotificationCenterConfigurationUpdate from '../../graphql/NotificationCenterConfigurationUpdate';
import './NotificationCenterContent.scss';

class NotificationCenterContent extends PureComponent {
  static propTypes = {
    notifications: PropTypes.query({
      notificationCenter: PropTypes.pageable(PropTypes.notificationCenter),
    }).isRequired,
    notificationsTypes: PropTypes.query({
      notificationCenterTypes: PropTypes.objectOf(PropTypes.string),
    }).isRequired,
    notificationsConfiguration: PropTypes.query({
      notificationCenterConfiguration: PropTypes.object,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    bulkUpdate: PropTypes.func.isRequired,
    notificationsConfigurationUpdate: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  state = {
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  componentDidMount() {
    document.addEventListener('click', this.onCloseHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onCloseHandler);
  }

  /**
   * Manual control closing of popover with notifications to prevent close when clicked
   * on content inside NotificationCenterContainer and inside Notifications__toast elements.
   *
   * @param e
   */
  onCloseHandler = (e) => {
    const element = e.target;
    const notificationCenterTrigger = document.getElementById('NotificationCenterTrigger');
    const notificationCenterContainer = document.getElementById('NotificationCenterContainer');
    const notificationWSContainers = [...document.getElementsByClassName('Notifications__toast')];

    const shouldClose = !(
      element === notificationCenterTrigger
      || element === notificationCenterContainer
      || (notificationCenterContainer && notificationCenterContainer.contains(element))
      || notificationWSContainers.includes(element)
      || notificationWSContainers.some(container => container.contains(element))
    );

    if (shouldClose) {
      this.props.close();
    }
  };

  selectItems = (allRowsSelected, touchedRowsIds) => {
    this.setState({ allRowsSelected, touchedRowsIds });
  };

  onSubmit = (notificationTypes, read) => {
    const {
      notifications,
      notifications: {
        variables: { args },
      },
    } = this.props;

    notifications.refetch({
      args: {
        ...args,
        notificationTypes: notificationTypes.length
          ? notificationTypes
          : undefined,
        read: typeof read === 'number'
          ? !!read
          : undefined,
      },
    });

    this.resetSelection();
  };

  bulkUpdate = async () => {
    const {
      bulkUpdate,
      notifications: {
        refetch,
        data: notificationsData,
        variables: { args: searchParams },
      },
      notify,
    } = this.props;

    const { allRowsSelected, touchedRowsIds } = this.state;
    const { totalElements, content } = notificationsData?.notificationCenter || {};

    const uuids = content
      .map(({ uuid }, index) => touchedRowsIds.includes(index) && uuid)
      .filter(Boolean);

    try {
      await bulkUpdate({
        variables: {
          searchParams,
          totalElements: totalElements > MAX_SELECTED_ROWS ? MAX_SELECTED_ROWS : totalElements,
          ...(allRowsSelected ? { excUuids: uuids } : { incUuids: uuids }),
        },
      });

      refetch();
    } catch (e) {
      const { error } = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('NOTIFICATION_CENTER.TOOLTIP.UPDATE_FAILED'),
        message: error,
      });
    }

    this.resetSelection();
  };

  handleSwitchNotificationConfiguration = async (showNotificationsPopUp) => {
    const { notificationsConfigurationUpdate, notify } = this.props;

    try {
      await notificationsConfigurationUpdate({ variables: { showNotificationsPopUp } });

      notify({
        level: 'success',
        title: I18n.t('COMMON.ACTIONS.SUCCESSFULLY'),
        message: I18n.t('COMMON.ACTIONS.UPDATED'),
      });
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('NOTIFICATION_CENTER.TOOLTIP.UPDATE_FAILED'),
      });

      throw e;
    }
  };

  resetSelection = () => {
    this.setState({ allRowsSelected: false, touchedRowsIds: [] });
  };

  getSelectedRowLength = () => {
    const { notifications } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    const totalElements = get(notifications, 'data.notificationCenter.totalElements');

    let selectedRowsLength = touchedRowsIds.length;

    if (allRowsSelected) {
      selectedRowsLength = totalElements > MAX_SELECTED_ROWS
        ? MAX_SELECTED_ROWS - selectedRowsLength
        : totalElements - selectedRowsLength;
    }

    return selectedRowsLength;
  };

  render() {
    const {
      onCloseModal,
      notifications,
      notificationsTypes: { data: notificationsTypesData },
      notificationsConfiguration,
    } = this.props;

    const { allRowsSelected, touchedRowsIds } = this.state;

    const typesData = get(notificationsTypesData, 'notificationCenterTypes') || [];
    const notificationsTypes = Object.keys(typesData);

    const totalElements = get(notifications, 'data.notificationCenter.totalElements');
    const { showNotificationsPopUp } = get(notificationsConfiguration, 'data.notificationCenterConfiguration') || {};

    return (
      <div className="NotificationCenterContent">
        <div className="NotificationCenterContent__header">
          <div>
            <div className="NotificationCenterContent__headline">
              {totalElements} {I18n.t('NOTIFICATION_CENTER.TOOLTIP.HEADLINE')}
            </div>
            <div className="NotificationCenterContent__subline">
              {this.getSelectedRowLength()} {I18n.t('NOTIFICATION_CENTER.TOOLTIP.SUBLINE')}
            </div>
          </div>
          <div className="NotificationCenterContent__actions">
            <If condition={!notificationsConfiguration.loading}>
              <div className="NotificationCenterConfiguration">
                <div className="NotificationCenterConfiguration__title">
                  {I18n.t('NOTIFICATION_CENTER.SHOW_POPUP')}
                </div>
                <ReactSwitch
                  on={showNotificationsPopUp}
                  className="NotificationCenterConfiguration__switcher"
                  onClick={this.handleSwitchNotificationConfiguration}
                />
              </div>
            </If>
            <If condition={allRowsSelected || touchedRowsIds.length}>
              <Button
                className="NotificationCenterContent__markAsRead"
                onClick={this.bulkUpdate}
                commonOutline
              >
                {I18n.t('COMMON.MARK_AS_READ')}
              </Button>
            </If>
          </div>
        </div>
        <NotificationCenterForm
          className="NotificationCenterContent__form"
          notificationsTypes={notificationsTypes}
          onSubmit={this.onSubmit}
        />
        <NotificationCenterTable
          className="NotificationCenterContent__table"
          notifications={notifications}
          allRowsSelected={allRowsSelected}
          touchedRowsIds={touchedRowsIds}
          selectItems={this.selectItems}
          onCloseModal={onCloseModal}
        />
      </div>
    );
  }
}

export default compose(
  withRequests({
    notifications: NotificationCenterQuery,
    notificationsTypes: NotificationCenterTypesQuery,
    notificationsConfiguration: NotificationCenterConfigurationQuery,
    bulkUpdate: NotificationCenterUpdate,
    notificationsConfigurationUpdate: NotificationCenterConfigurationUpdate,
  }),
  withNotifications,
)(NotificationCenterContent);
