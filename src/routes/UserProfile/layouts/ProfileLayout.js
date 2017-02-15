import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Status from '../components/Status';
import moment from 'moment';

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
          <Status
            data={data}
          />
          <hr />

          <div className="player__account__details row panel-body">

            <div className="player__account__details_personal col-md-3">
              <span className="player__account__details_personal-label">Personal information</span>
              <div className="panel panel-with-borders">
                <div className="panel-body padding-5">
                  {
                    !!data.birthDate &&
                    <div><b>Date of birth</b>: {moment().format('DD.MM.YYYY')}</div>
                  }

                  <div><b>Gender</b>: Male</div>
                  <div><b>Phone</b>: +380 500777974</div>
                  <div><b>Email</b>: migoweb@gmail.com</div>
                  <div><b>Country</b>: Ukraine</div>
                  <div><b>Full address</b>: vul. Eleny Teligy 1</div>
                  <div><b>City</b>: Kyiv</div>
                  <div><b>Post code</b>: 03129</div>
                </div>
              </div>
            </div>

          </div>

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
