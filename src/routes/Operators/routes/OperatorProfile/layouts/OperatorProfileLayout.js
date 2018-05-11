import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import Information from '../components/Information';
import Tabs from '../../../../../components/Tabs';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import PropTypes from '../../../../../constants/propTypes';
import Card from '../../../../../components/Card';
import ConfirmActionModal from '../../../../../components/Modal/ConfirmActionModal';
import HideDetails from '../../../../../components/HideDetails';

const RESET_PASSWORD_MODAL = 'operator-password-reset-modal';
const SEND_INVITE_MODAL = 'operator-send-invite-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class OperatorProfileLayout extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    data: PropTypes.operatorProfile.isRequired,
    availableStatuses: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    onSendInvitation: PropTypes.func.isRequired,
    fetchAuthority: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
  };

  componentDidMount() {
    this.props.fetchAuthority(this.props.params.id);
  }

  handleResetPasswordClick = async () => {
    this.handleOpenModal(RESET_PASSWORD_MODAL);
  };

  handleResetPasswordSubmit = async () => {
    const {
      onResetPassword,
      params: {
        id: operatorUUID,
      },
    } = this.props;

    await onResetPassword(operatorUUID);

    this.handleCloseModal();
  };

  handleSendInvitationClick = async () => {
    this.handleOpenModal(SEND_INVITE_MODAL);
  };

  handleSendInvitationSubmit = async () => {
    const { data, onSendInvitation } = this.props;

    await onSendInvitation(data.uuid);
    this.handleCloseModal();
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

  handleCloseModal = () => {
    this.setState({ modal: { ...modalInitialState } });
  };

  render() {
    const { modal } = this.state;
    const {
      location,
      params,
      children,
      data,
      availableStatuses,
      changeStatus,
      authorities: { data: authorities },
    } = this.props;

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
        <Card noBorders>
          {children}
        </Card>
        {
          modal.name === RESET_PASSWORD_MODAL &&
          <ConfirmActionModal
            onSubmit={this.handleResetPasswordSubmit}
            onClose={this.handleCloseModal}
            modalTitle={I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE')}
            actionText={I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT')}
            fullName={[data.firstName, data.lastName].join(' ')}
            uuid={data.uuid}
            additionalText={I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET')}
            submitButtonLabel={I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION')}
          />
        }

        {
          modal.name === SEND_INVITE_MODAL &&
          <ConfirmActionModal
            onSubmit={this.handleSendInvitationSubmit}
            onClose={this.handleCloseModal}
            modalTitle={I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.TITLE')}
            actionText={I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.ACTION_TEXT')}
            fullName={[data.firstName, data.lastName].join(' ')}
            uuid={data.uuid}
            submitButtonLabel={I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.CONFIRM_ACTION')}
          />
        }
      </div>
    );
  }
}

export default OperatorProfileLayout;
