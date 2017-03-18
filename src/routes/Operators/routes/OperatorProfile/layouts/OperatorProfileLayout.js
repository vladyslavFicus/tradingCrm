import React, { Component, PropTypes } from 'react';
import Tabs from 'components/Tabs';
import Information from 'components/Information/Container';
import { operatorProfileTabs } from 'config/menu';
import Header from '../components/Header';
import "./OperatorProfileLayout.scss";

export default class OperatorProfileLayout extends Component {
  state = {
    informationShown: true,
  };

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    location: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.object,
    onResetPassword: PropTypes.func.isRequired,
  };

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
    } = this.props;

    const {
      informationShown,
    } = this.state;

    const ip = {
      entities: {
        content: [],
      },
    };

    return (
      <div className="player container panel operator-profile-layout">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <Header
                operatorProfile={data}
                onResetPasswordClick={this.handleResetPasswordClick}
                onStatusChange={this.handleStatusChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 operator-profile-layout-info-toggle">
              <button
                className="operator-profile-layout-info-toggle-button"
                onClick={this.handleToggleInformationBlock}
              >
                {!informationShown ? 'Show details' : 'Hide details'}
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
              updateSubscription={() => {
              } /* updateSubscription.bind(null, params.id) */}
              showNotes={false}
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
