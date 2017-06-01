import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import Tabs from '../../../../../components/Tabs';
import Modal from '../../../../../components/Modal';
import Information from '../components/Information';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import modalCssModule from '../styles/InfoModal.scss';
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
          header: 'Operators password reset - Confirmation',
          body: (
            <div className="modal-body_text">
              You are about to reset password for <br /> Helen Cassar - <span className="modal-body_uid">OP-659d4581</span> operator account
            </div>
          ),
          footer: (
            <div>
              <div className="col-xs-6 text-left">
                <button className="btn-default-outline btn btn-secondary" onClick={this.handleCloseModal}>
                  Close
                </button>
              </div>
              <div className="col-xs-6">
                <button className="btn btn-danger">
                  Reset password
                </button>
              </div>
            </div>
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
          header: 'Send invitation to operator - Confirmation',
          body: (
            <div className="modal-body_text">
              You are about to send an invation to <br /> operator Helen Cassar - <span className="modal-body_uid">OP-659d4581</span>
            </div>
          ),
          footer: (
            <div>
              <div className="col-xs-6 text-left">
                <button className="btn-default-outline btn btn-secondary" onClick={this.handleCloseModal}>
                  Close
                </button>
              </div>
              <div className="col-xs-6">
                <button className="btn btn-danger">
                  Reset password
                </button>
              </div>
            </div>
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
      <div className="player container panel profile-layout">
        <div className="container-fluid">
          <div className="profile-layout-heading">
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
              <button
                className="hide-details-block_text btn-transparent"
                onClick={this.handleToggleInformationBlock}
              >
                {informationShown ?
                  I18n.t('COMMON.DETAILS_COLLAPSE.HIDE') :
                  I18n.t('COMMON.DETAILS_COLLAPSE.SHOW')
                }
              </button>

              <div className="hide-details-block_arrow" />
            </div>

            <Collapse isOpen={informationShown}>
              <Information
                data={data}
                ips={ip.list}
              />
            </Collapse>
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
            cssModule={modalCssModule}
            {...modal.params}
          />
        }
      </div>
    );
  }
}

export default OperatorProfileLayout;
