import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { parseErrors, withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import ReactSwitch from 'components/ReactSwitch';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import NotificationCenterForm from '../NotificationCenterForm';
import NotificationCenterTable from '../NotificationCenterTable';
import NotificationCenterQuery from '../../graphql/NotificationCenterQuery';
import NotificationCenterTypesQuery from '../../graphql/NotificationCenterTypesQuery';
import NotificationCenterConfigurationQuery from '../../graphql/NotificationCenterConfigurationQuery';
import NotificationCenterUpdate from '../../graphql/NotificationCenterUpdate';
import NotificationCenterConfigurationUpdate from '../../graphql/NotificationCenterConfigurationUpdate';
import './NotificationCenterContent.scss';

const MAX_SELECTED_ROWS = 1000;

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
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    bulkUpdate: PropTypes.func.isRequired,
    notificationsConfigurationUpdate: PropTypes.func.isRequired,
  };

  state = {
    allRowsSelected: false,
    touchedRowsIds: [],
  };

  selectItems = (allRowsSelected, touchedRowsIds) => {
    this.setState({ allRowsSelected, touchedRowsIds });

    if (allRowsSelected) {
      const {
        onCloseModal,
        notifications,
        modals: { confirmationModal },
      } = this.props;

      const { totalElements } = get(notifications, 'data.notificationCenter');

      if (totalElements > MAX_SELECTED_ROWS) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          onCloseCallback: onCloseModal(),
          modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
          actionText: I18n.t('NOTIFICATION_CENTER.TOOLTIP.ERRORS.SELECTED_MORE_THAN_MAX', { max: MAX_SELECTED_ROWS }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
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
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withNotifications,
)(NotificationCenterContent);
