import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Switch, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import Tabs from 'components/Tabs';
import NotFound from 'routes/NotFound';
import { operatorTypes } from 'constants/operators';
import * as menu from 'config/menu';
import PropTypes from 'constants/propTypes';
import HideDetails from 'components/HideDetails';
import PartnerEdit from 'routes/Partners/routes/OperatorProfile/routes/Edit';
import { Route } from 'router';
import Information from '../components/Information';
import OperatorEdit from '../routes/Edit';
import Feed from '../routes/Feed';
import Header from '../components/Header';

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
    refetchOperator: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    onSendInvitation: PropTypes.func.isRequired,
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
      modals: { confirmActionModal },
      onResetPassword,
      match: {
        params: {
          id: operatorUUID,
        },
      },
    } = this.props;

    await onResetPassword(operatorUUID);

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
      data,
      onSendInvitation,
      modals: { confirmActionModal },
    } = this.props;

    await onSendInvitation(data.uuid);

    confirmActionModal.hide();
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        ...this.state.modal,
        name,
        params,
      },
    });
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
  }

  render() {
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
          items={menu[`${operatorType.toLowerCase()}ProfileTabs`]}
          location={location}
          params={params}
        />
        <div className="card no-borders" >
          <Switch>
            <Route
              path={`${path}/profile`}
              component={operatorType === operatorTypes.OPERATOR ? OperatorEdit : PartnerEdit}
            />
            <Route path={`${path}/feed`} component={Feed} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default OperatorProfileLayout;
