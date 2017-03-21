import React, { Component, PropTypes } from 'react';
import Tabs from '../../../../../components/Tabs';
import Information from '../components/Information';
import { operatorProfileTabs } from '../../../../../config/menu';
import Header from '../components/Header';
import './OperatorProfileLayout.scss';

class OperatorProfileLayout extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    location: PropTypes.object,
    children: PropTypes.node,
    data: PropTypes.object,
    availableStatuses: PropTypes.array.isRequired,
    changeStatus: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchIp: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    ip: PropTypes.object.isRequired,
  };

  state = {
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

  handleResetPasswordClick = () => {
    const { onResetPassword, data } = this.props;

    return onResetPassword({ email: data.email });
  };

  handleStatusChange = () => {
    // @TODO: Implement logic
  };

  render() {
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
          <div className="row">
            <div className="col-md-12">
              <Header
                data={data}
                lastIp={lastIp}
                availableStatuses={availableStatuses}
                onResetPasswordClick={this.handleResetPasswordClick}
                onStatusChange={changeStatus}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 operator-profile-layout-info-toggle">
              <button
                className="operator-profile-layout-info-toggle-button"
                onClick={this.handleToggleInformationBlock}
              >
                {informationShown ? 'Hide details' : 'Show details'}
              </button>
              <div className="col-xs-12">
                <hr />
              </div>
            </div>
          </div>

          {
            informationShown &&
            <Information
              data={data}
              ips={ip.entities.content}
            />
          }

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
      </div>
    );
  }
}

export default OperatorProfileLayout;
