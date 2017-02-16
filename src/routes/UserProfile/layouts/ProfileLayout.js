import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information';

import { userProfileTabsNew } from 'config/menu';
import { actionCreators as profileViewActionCreators } from '../modules/view';
import { actionCreators as bonusActionCreators } from '../modules/bonus';

class ProfileLayout extends Component {
  componentWillMount() {
    const { profile, loadFullProfile, fetchActiveBonus, params } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchActiveBonus(params.id));
    }
  }

  render() {
    const { profile: { data }, children, params, location } = this.props;

    return (
      <div className="player container panel ">
        <div className="container-fluid">
          <Header
            data={data}
          />
          <Information
            data={data}
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
const mapStateToProps = ({ userProfile, userBonus: bonus }) => ({
  ...userProfile,
  bonus,
});
const mapActions = {
  ...profileViewActionCreators,
  ...bonusActionCreators,
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
