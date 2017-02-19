import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import { getAvailableTags } from 'config/index';

import { userProfileTabsNew } from 'config/menu';
import { actionCreators as userProfileActionCreators } from '../modules';

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
    const {
      profile: { data },
      children,
      params,
      ip,
      location,
      availableTags,
      addTag,
      deleteTag,
    } = this.props;

    return (
      <div className="player container panel ">
        <div className="container-fluid">
          <Header
            data={data}
            availableTags={availableTags}
            addTag={addTag.bind(null, params.id)}
            deleteTag={deleteTag.bind(null, params.id)}
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
const mapStateToProps = ({ profile: { view: userProfile, bonus, ip }, auth }) => ({
  ...userProfile,
  bonus,
  ip,
  availableTags: getAvailableTags(auth.department),
});

const mapActions = {
  ...userProfileActionCreators,
  fetchIp: userProfileActionCreators.fetchEntities,

  //TODO resolve multi-fetchEntities func conflict
};

export default connect(mapStateToProps, mapActions)(ProfileLayout);
