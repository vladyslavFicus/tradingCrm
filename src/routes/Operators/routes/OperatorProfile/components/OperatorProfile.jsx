import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from '../../../../../router';
import Information from '../components/Information';
import Tabs from '../../../../../components/Tabs';
import NotFound from '../../../../../routes/NotFound';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import PropTypes from '../../../../../constants/propTypes';
import HideDetails from '../../../../../components/HideDetails';
import Edit from '../routes/Edit';
import Feed from '../routes/Feed';

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
    onResetPassword: PropTypes.func.isRequired,
    onSendInvitation: PropTypes.func.isRequired,
    fetchAuthority: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    authorities: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };

  static defaultProps={
    error: null,
  };

  componentDidMount() {
    const { fetchProfile, fetchAuthority, match: { params: { id } } } = this.props;

    fetchProfile(id);
    fetchAuthority(id);
  }

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

  render() {
    const {
      location,
      match: { params, path, url },
      data,
      isLoading,
      error,
      availableStatuses,
      changeStatus,
      authorities: { data: authorities },
    } = this.props;

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
          />
          <HideDetails>
            <Information
              data={data}
              authorities={authorities}
            />
          </HideDetails>
        </div>
        <Tabs
          items={operatorProfileTabs}
          location={location}
          params={params}
        />
        <div className="card no-borders" >
          <Switch>
            <Route path={`${path}/profile`} component={Edit} />
            <Route path={`${path}/feed`} component={Feed} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default OperatorProfileLayout;
