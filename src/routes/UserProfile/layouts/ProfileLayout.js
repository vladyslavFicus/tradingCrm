import React, { Component } from 'react';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import { userProfileTabs } from 'config/menu';

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
    const { profile: { data }, children, params, ip, location } = this.props;

    return (
      <div className="player container panel ">
        <div className="container-fluid">
          <Header
            data={data}
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
                    items={userProfileTabs}
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

export default ProfileLayout;
