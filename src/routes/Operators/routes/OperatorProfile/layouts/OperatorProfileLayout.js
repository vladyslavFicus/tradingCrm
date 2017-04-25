import React, { Component } from 'react';
import Tabs from '../../../../../components/Tabs';
import Modal from '../../../../../components/Modal';
import Information from '../components/Information';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import './OperatorProfileLayout.scss';
import PropTypes from '../../../../../constants/propTypes';

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
      list: PropTypes.arrayOf(PropTypes.ipEntity).isRequired,
    }).isRequired,
    lastIp: PropTypes.ipEntity,
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
    const { onResetPassword, data } = this.props;

    if (data.email) {
      const action = await onResetPassword({ email: data.email });

      if (action && !action.error) {
        this.handleOpenModal(INFO_MODAL, {
          header: 'Reset password',
          body: (
            <span>
              Reset password link was sent to <strong>{data.email}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default" onClick={this.handleCloseModal}>
              Close
            </button>
          ),
        });
      }
    }
  };

  handleSendInvitationClick = async () => {
    const { onSendInvitation, data, params: { id: operatorUUID } } = this.props;

    if (operatorUUID) {
      const action = await onSendInvitation(operatorUUID);

      if (action && !action.error) {
        this.handleOpenModal(INFO_MODAL, {
          header: 'Send invitation link',
          body: (
            <span>
              Invitation link was sent to <strong>{data.email || operatorUUID}</strong>.
            </span>
          ),
          footer: (
            <button className="btn btn-default" onClick={this.handleCloseModal}>
              Close
            </button>
          ),
        });
      }
    }
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
      <div className="player container panel operator-profile-layout">
        <div className="container-fluid">
          <div className="operator-profile-layout-heading">
            <div className="row">
              <div className="col-md-12">
                <Header
                  data={data}
                  lastIp={lastIp}
                  availableStatuses={availableStatuses}
                  onResetPasswordClick={this.handleResetPasswordClick}
                  onSendInvitationClick={this.handleSendInvitationClick}
                  onStatusChange={changeStatus}
                />
              </div>
            </div>

            <div className="hide-details-block">
              <div className="hide-details-block_arrow" />
              <div className="hide-details-block_text" onClick={this.handleToggleInformationBlock}>
                {informationShown ? 'Hide details' : 'Show details'}
              </div>
              <div className="hide-details-block_arrow" />
            </div>

            {
              informationShown &&
              <Information
                data={data}
                ips={ip.list}
              />
            }
          </div>
          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={operatorProfileTabs}
                    location={location}
                    params={params}
                  />
                  <div className="tab-content padding-vertical-20">
                    {children}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        {
          modal.name === INFO_MODAL &&
          <Modal
            onClose={this.handleCloseModal}
            isOpen
            {...modal.params}
          />
        }
      </div>
    );
  }
}

export default OperatorProfileLayout;
