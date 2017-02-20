import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import { userProfileTabsNew } from 'config/menu';
import { actionCreators as ipActionCreators } from '../modules/ip';
import { actionCreators as bonusActionCreators } from '../modules/bonus';
import { actionCreators as viewActionCreators } from '../modules/view';
import { statusActions } from 'config/user';

class ProfileLayout extends Component {
  componentWillMount() {
    const { profile, loadFullProfile, fetchActiveBonus, fetchIp, params } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchActiveBonus(params.id))
        .then(() => fetchIp(params.id, { limit: 10 }));
    }
  }

  render() {
    const { profile: { data }, children, params, ip, location, nextStatuses, changeStatus } = this.props;

    return (
      <div className="player container panel ">
        <div className="container-fluid">
          <Header
            data={data}
            nextStatuses={nextStatuses}
            onStatusChange={changeStatus}
          />
          <Information
            data={data}
            ips={ip.entities.content}
          />
          <hr />

          <div className="row">
            <section className="panel profile-user-content">
              <div className="panel-body">
                <div className="nav-tabs-horizontal">
                  <Tabs
                    items={userProfileTabsNew}
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
const mapStateToProps = ({ profile: { view: userProfile, bonus, ip } }) => ({
    ...userProfile,
    bonus,
    ip,
    nextStatuses: userProfile && userProfile.profile && userProfile.profile.data
      ? statusActions[userProfile.profile.data.profileStatus]
        ? statusActions[userProfile.profile.data.profileStatus]
        : []
      : [],
  })
;

const mapActions = {
  fetchIp: ipActionCreators.fetchEntities,
  changeStatus: viewActionCreators.changeStatus,

  acceptBonus: bonusActionCreators.acceptBonus,
  cancelBonus: bonusActionCreators.cancelBonus,
  fetchActiveBonus: bonusActionCreators.fetchActiveBonus,

  checkLock: viewActionCreators.checkLock,
  fetchBalances: viewActionCreators.fetchBalances,
  fetchProfile: viewActionCreators.fetchProfile,
  getBalance: viewActionCreators.getBalance,
  loadFullProfile: viewActionCreators.loadFullProfile,
  lockDeposit: viewActionCreators.lockDeposit,
  lockWithdraw: viewActionCreators.lockWithdraw,
  unlockDeposit: viewActionCreators.unlockDeposit,
  unlockWithdraw: viewActionCreators.unlockWithdraw,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
