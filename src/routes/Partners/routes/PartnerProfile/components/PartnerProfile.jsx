import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Switch, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import * as menu from 'config/menu';
import PropTypes from 'constants/propTypes';
import HideDetails from 'components/HideDetails';
import ChangePasswordModal from 'components/ChangeOperatorPasswordModal';
import { Route } from 'router';
import PartnerEdit from '../routes/Edit';
import Feed from '../routes/Feed';
import Information from './Information';
import Header from './Header';

const MODAL_CHANGE_PASSWORD = 'change-password-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class PartnerProfileLayout extends Component {
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
    refetchPartner: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    sendInvitation: PropTypes.func.isRequired,
    authorities: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    getLoginLock: PropTypes.object.isRequired,
    unlockLoginMutation: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps={
    error: null,
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
      modalTitle: I18n.t('PARTNER_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      actionText: I18n.t('PARTNER_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT'),
      fullName: [data.firstName, data.lastName].join(' '),
      uuid: data.uuid,
      additionalText: I18n.t('PARTNER_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET'),
      submitButtonLabel: I18n.t('PARTNER_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION'),
    });
  };

  handleResetPasswordSubmit = async () => {
    const {
      resetPassword,
      brand: { brand },
      match: { params: { id } },
      modals: { confirmActionModal },
    } = this.props;

    await resetPassword({
      variables: {
        uuid: id,
        brand,
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
      modalTitle: I18n.t('PARTNER_PROFILE.MODALS.SEND_INVITATION.TITLE'),
      actionText: I18n.t('PARTNER_PROFILE.MODALS.SEND_INVITATION.ACTION_TEXT'),
      fullName: [data.firstName, data.lastName].join(' '),
      uuid: data.uuid,
      submitButtonLabel: I18n.t('PARTNER_PROFILE.MODALS.SEND_INVITATION.CONFIRM_ACTION'),
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
    const { data: { partnerProfile: { firstName, lastName, uuid } } } = this.props;

    this.handleOpenModal(MODAL_CHANGE_PASSWORD, {
      fullName: `${firstName} ${lastName}`,
      operatorUUID: `${uuid}`,
    });
  };

  handleSubmitNewPassword = async ({ password }) => {
    const { changePassword, notify, match: { params: { id: playerUUID } } } = this.props;

    const response = await changePassword({ variables: { password, playerUUID } });
    const success = get(response, 'data.profile.changePassword.success');

    notify({
      level: !success ? 'error' : 'success',
      title: !success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.TITLE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.TITLE'),
      message: !success
        ? I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_SET_NEW_PASSWORD.MESSAGE')
        : I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_SET_NEW_PASSWORD.MESSAGE'),
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
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.SUCCESS_UNLOCK.MESSAGE'),
      });
    } else {
      notify({
        level: 'error',
        title: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.TITLE'),
        message: I18n.t('PARTNER_PROFILE.NOTIFICATIONS.ERROR_UNLOCK.MESSAGE'),
      });
    }
  };

  render() {
    const { modal } = this.state;

    const {
      location,
      match: { params, path, url },
      data: {
        uuid,
        phone,
        email,
        status,
        country,
        lastName,
        fullName,
        createdAt,
        firstName,
        statusChangeDate,
        statusChangeAuthor,
      },
      isLoading,
      error,
      availableStatuses,
      changeStatus,
      refetchPartner,
      authorities: { data: authorities },
      getLoginLock,
    } = this.props;
    const loginLock = get(getLoginLock, 'loginLock', {});
    const tabs = [...menu.partnerProfileTabs];

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
            data={{
              uuid,
              status,
              country,
              fullName,
              createdAt,
              statusChangeDate,
              statusChangeAuthor,
            }}
            availableStatuses={availableStatuses}
            onResetPasswordClick={this.handleResetPasswordClick}
            onChangePasswordClick={this.handleChangePasswordClick}
            onSendInvitationClick={this.handleSendInvitationClick}
            onStatusChange={changeStatus}
            refetchPartner={refetchPartner}
            unlockLogin={this.unlockLogin}
            loginLock={loginLock}
          />
          <HideDetails>
            <Information
              data={{
                firstName,
                createdAt,
                lastName,
                country,
                email,
                phone,
              }}
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
            <Route path={`${path}/profile`} component={PartnerEdit} />
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

export default PartnerProfileLayout;
