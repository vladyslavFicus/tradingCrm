import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Information from '../components/Information';
import Tabs from '../../../../../components/Tabs';
import Modal from '../../../../../components/Modal';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import PropTypes from '../../../../../constants/propTypes';
import Uuid from '../../../../../components/Uuid';

const INFO_MODAL = 'info-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class OperatorProfileLayout extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    location: PropTypes.object,
    children: PropTypes.node,
    data: PropTypes.operatorProfile.isRequired,
    availableStatuses: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchIp: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    onSendInvitation: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    ip: PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.operatorIpEntity).isRequired,
    }).isRequired,
    lastIp: PropTypes.operatorIpEntity,
  };

  state = {
    modal: { ...modalInitialState },
    informationShown: true,
  };

  componentDidMount() {
    const {
      isLoading,
      fetchProfile,
      params: { id },
      fetchIp,
    } = this.props;

    if (!isLoading) {
      fetchProfile(id)
        .then(() => fetchIp(id, { limit: 10 }));
    }
  }

  handleToggleInformationBlock = () => {
    this.setState({ informationShown: !this.state.informationShown });
  };

  handleResetPasswordClick = async () => {
    const { data } = this.props;

    this.handleOpenModal(INFO_MODAL, {
      header: I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.TITLE'),
      body: (
        <div className="text-center">
          <span className="font-weight-700">
            {I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TEXT', {
              fullName: [data.firstName, data.lastName].join(' '),
            })}
          </span>
          {' '}
          <Uuid uuid={data.uuid} />
          {' - '}
          <span className="font-weight-700">
            {I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.ACTION_TARGET')}
          </span>
        </div>
      ),
      footer: (
        <div className="row">
          <div className="col-xs-6 text-left">
            <button className="btn-default-outline btn btn-secondary" onClick={this.handleCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
          </div>
          <div className="col-xs-6">
            <button className="btn btn-danger" onClick={this.handleResetPasswordSubmit}>
              {I18n.t('OPERATOR_PROFILE.MODALS.RESET_PASSWORD.CONFIRM_ACTION')}
            </button>
          </div>
        </div>
      ),
    });
  };

  handleResetPasswordSubmit = async () => {
    const { onResetPassword, data } = this.props;

    if (data.email) {
      await onResetPassword({ email: data.email });

      this.handleCloseModal();
    }
  };

  handleSendInvitationClick = async () => {
    const { data } = this.props;

    this.handleOpenModal(INFO_MODAL, {
      header: I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.TITLE'),
      body: (
        <div className="text-center">
          <span className="font-weight-700">
            {I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.ACTION_TEXT', {
              fullName: [data.firstName, data.lastName].join(' '),
            })}
          </span>
          {' '}
          <Uuid uuid={data.uuid} />
          {' - '}
          <span className="font-weight-700">
            {I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.ACTION_TARGET')}
          </span>
        </div>
      ),
      footer: (
        <div className="row">
          <div className="col-xs-6 text-left">
            <button className="btn-default-outline btn btn-secondary" onClick={this.handleCloseModal}>
              {I18n.t('COMMON.BUTTONS.CANCEL')}
            </button>
          </div>
          <div className="col-xs-6">
            <button className="btn btn-danger" onClick={this.handleSendInvitationSubmit}>
              {I18n.t('OPERATOR_PROFILE.MODALS.SEND_INVITATION.CONFIRM_ACTION')}
            </button>
          </div>
        </div>
      ),
    });
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
      ip,
      lastIp,
      availableStatuses,
      changeStatus,
    } = this.props;

    const {
      informationShown,
    } = this.state;

    return (
      <div className="panel profile-layout operators-profile-layout">
        <div className="profile-layout-heading">
          <Header
            data={data}
            lastIp={lastIp}
            availableStatuses={availableStatuses}
            onResetPasswordClick={this.handleResetPasswordClick}
            onSendInvitationClick={this.handleSendInvitationClick}
            onStatusChange={changeStatus}
          />
          <div className="hide-details-block">
            <div className="hide-details-block_divider" />
            <button
              className="hide-details-block_text btn-transparent"
              onClick={this.handleToggleInformationBlock}
            >
              {informationShown ?
                I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') :
                I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
              }
            </button>

            <div className="hide-details-block_divider" />
          </div>

          <Collapse isOpen={informationShown}>
            <Information
              data={data}
              ips={ip.list}
            />
          </Collapse>
        </div>
        <div className="panel profile-user-content">
          <div className="nav-tabs-horizontal">
            <Tabs
              items={operatorProfileTabs}
              location={location}
              params={params}
            />
            <div>
              {children}
            </div>
          </div>
        </div>
        {
          modal.name === INFO_MODAL &&
          <Modal
            onClose={this.handleCloseModal}
            className="modal-danger"
            isOpen
            {...modal.params}
          />
        }
      </div>
    );
  }
}

export default OperatorProfileLayout;
