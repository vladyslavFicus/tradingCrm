import React, { PureComponent } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withModals, withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import ConfirmActionModal from 'components/Modal/ConfirmActionModal';
import NotificationCenterForm from '../NotificationCenterForm';
import NotificationCenterTable from '../NotificationCenterTable';
import NotificationCenterQuery from '../../graphql/NotificationCenterQuery';
import NotificationCenterTypesQuery from '../../graphql/NotificationCenterTypesQuery';
import NotificationCenterUpdate from '../../graphql/NotificationCenterUpdate';
import './NotificationCenterContent.scss';

const MAX_SELECTED_ROWS = 10000;

class NotificationCenterContent extends PureComponent {
  static propTypes = {
    notifications: PropTypes.query({
      notificationCenter: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.notificationCenter),
        error: PropTypes.any,
      }),
    }).isRequired,
    notificationsTypes: PropTypes.query({
      notificationCenterTypes: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.string),
      }),
    }).isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
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

      const { totalElements } = get(
        notifications,
        'data.notificationCenter.data',
      );

      if (totalElements > MAX_SELECTED_ROWS) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          onCloseCallback: onCloseModal(),
          modalTitle: `${MAX_SELECTED_ROWS} ${I18n.t('NOTIFICATION_CENTER.TOOLTIP.MAX_ITEM_SELECTED')}`,
          actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: MAX_SELECTED_ROWS }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
  };

  selectType = (notificationTypes) => {
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
      },
    });

    this.resetSelection();
  };

  bulkUpdate = async () => {
    const { bulkUpdate, notifications, notify } = this.props;

    const { allRowsSelected, touchedRowsIds } = this.state;

    const { totalElements, content } = get(
      notifications,
      'data.notificationCenter.data',
    );

    const uuids = content
      .map(({ uuid }, index) => touchedRowsIds.includes(index) && uuid)
      .filter(Boolean);

    const {
      data: {
        notificationCenter: {
          update: { error },
        },
      },
    } = await bulkUpdate({
      variables: {
        totalElements: totalElements > MAX_SELECTED_ROWS ? MAX_SELECTED_ROWS : totalElements,
        ...(allRowsSelected ? { excUuids: uuids } : { incUuids: uuids }),
      },
    });

    if (error) {
      notify({
        level: 'error',
        title: I18n.t('NOTIFICATION_CENTER.TOOLTIP.UPDATE_FAILED'),
        message:
          error.error || error.fields_errors || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    } else {
      notifications.refetch();
    }

    this.resetSelection();
  };

  resetSelection = () => {
    this.setState({ allRowsSelected: false, touchedRowsIds: [] });
  };

  getSelectedRowLength = () => {
    const { notifications } = this.props;
    const { allRowsSelected, touchedRowsIds } = this.state;

    const totalElements = get(notifications, 'data.notificationCenter.data.totalElements');

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
    } = this.props;

    const { allRowsSelected, touchedRowsIds } = this.state;

    const notificationsTypes = get(
      notificationsTypesData, 'notificationCenterTypes.data',
    ) || [];

    const totalElements = get(notifications, 'data.notificationCenter.data.totalElements');

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
          <div>
            <If condition={allRowsSelected || touchedRowsIds.length}>
              <Button
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
          onSubmit={this.selectType}
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
    bulkUpdate: NotificationCenterUpdate,
  }),
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withNotifications,
)(NotificationCenterContent);