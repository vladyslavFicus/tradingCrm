import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Switch, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import { operatorTypes } from 'constants/operators';
import * as menu from 'config/menu';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { isSales } from 'constants/hierarchyTypes';
import HideDetails from 'components/HideDetails';
import ChangePasswordModal from 'components/ChangeOperatorPasswordModal';
import Route from 'components/Route';
import Permissions from 'utils/permissions';
import OperatorEdit from '../routes/Edit';
import Feed from '../routes/Feed';
import SalesRules from '../routes/SalesRules';
import Information from './Information';
import Header from './Header';

const MODAL_CHANGE_PASSWORD = 'change-password-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class OperatorProfileLayout extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.operatorProfile.isRequired,
    availableStatuses: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    refetchOperator: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    sendInvitation: PropTypes.func.isRequired,
    authorities: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    operatorType: PropTypes.string,
    getLoginLock: PropTypes.object.isRequired,
    unlockLoginMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps={
    error: null,

    operatorType: operatorTypes.OPERATOR,
  };

  state = {
    modal: { ...modalInitialState },
  };

  handleResetPasswordClick = () => {
    const {
      data,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleResetPasswordSubmit,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      fullName: [data.firstName, data.lastName].join(' '),
      uuid: data.uuid,
      additionalText: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
    });
  };

  handleResetPasswordSubmit = async () => {
    const {
      resetPassword,
      match: { params: { id } },
      modals: { confirmActionModal },
    } = this.props;

    await resetPassword({
      variables: {
        uuid: id,
      },
    });

    confirmActionModal.hide();
  };

  handleSendInvitationClick = async () => {
    const {
      data,
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleSendInvitationSubmit,
      modalTitle: I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.TITLE'),
      actionText: I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.ACTION_TEXT'),
      fullName: [data.firstName, data.lastName].join(' '),
      uuid: data.uuid,
      submitButtonLabel: I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.CONFIRM_ACTION'),
    });
  };

  handleSendInvitationSubmit = async () => {
    const {
      data: { uuid },
      sendInvitation,
      modals: { confirmActionModal },
    } = this.props;

    await sendInvitation({ variables: { uuid } });

    confirmActionModal.hide();
  };

  handleChangePasswordClick = () => {
    const { data: operatorProfile } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${operatorProfile.firstName} ${operatorProfile.lastName}`,
      operatorUUID: `${operatorProfile.uuid}`,
    });
  };

  handleSubmitNewPassword = async ({ password }) => {
    const { changePassword, notify, match: { params: { id: playerUUID } } } = this.props;

    const response = await changePassword({ variables: { password, playerUUID } });
    const success = get(response, 'data.profile.changePassword.success');

    notify({
      level: !success ? 'error' : 'success',
      title: !success
        ? I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: !success
        ? I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
    });

    if (success) {
      this.handleCloseModal();
    }
  };

  handleOpenModal = (name, params) => {
    this.setState(({ modal }) => ({
      modal: {
        ...modal,
        name,
        params,
      },
    }));
  };

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  unlockLogin = async () => {
    const { unlockLoginMutation, match: { params: { id: playerUUID } }, notify } = this.props;
    const response = await unlockLoginMutation({ variables: { playerUUID } });
    const success = get(response, 'data.auth.unlockLogin.data.success');

    if (success) {
      notify({
        level: 'success',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('OPERATOR_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  render() {
    const { modal } = this.state;

    const {
      location,
      match: { params, path, url },
      data,
      isLoading,
      error,
      availableStatuses,
      changeStatus,
      refetchOperator,
      authorities: { data: authorities },
      operatorType,
      getLoginLock,
    } = this.props;

    const loginLock = get(getLoginLock, 'loginLock', {});
    const userType = get(data, 'hierarchy.userType');
    const tabs = [...menu[`${operatorType.toLowerCase()}ProfileTabs`]];

    // Check if operator is SALES to show sales rules tab
    if (isSales(userType)) {
      tabs.splice(1, 0, {
        label: 'OPERATOR_PROFILE.TABS.SALES_RULES',
        url: '/operators/:id/sales-rules',
        permissions: new Permissions(permissions.SALES_RULES.GET_RULES),
      });
    }

    if (error) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={data}
            availableStatuses={availableStatuses}
            onResetPasswordClick={this.handleResetPasswordClick}
            onChangePasswordClick={this.handleChangePasswordClick}
            onSendInvitationClick={this.handleSendInvitationClick}
            onStatusChange={changeStatus}
            refetchOperator={refetchOperator}
            unlockLogin={this.unlockLogin}
            loginLock={loginLock}
          />
          <HideDetails>
            <Information
              data={data}
              authorities={authorities}
            />
          </HideDetails>
        </div>
        <Tabs
          items={tabs}
          location={location}
          params={params}
        />
        <div className="card no-borders">
          <Switch>
            <Route path={`${path}/profile`} component={OperatorEdit} />
            <If condition={isSales(userType)}>
              <Route path={`${path}/sales-rules`} component={SalesRules} />
            </If>
            <Route path={`${path}/feed`} component={Feed} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </div>
        {
          modal.name === MODAL_CHANGE_PASSWORD
          && (
            <ChangePasswordModal
              {...modal.params}
              onClose={this.handleCloseModal}
              onSubmit={this.handleSubmitNewPassword}
            />
          )
        }
      </div>
    );
  }
}

export default OperatorProfileLayout;
