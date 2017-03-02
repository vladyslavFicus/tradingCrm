import React, { Component } from 'react';
import Tabs from '../components/Tabs';
import Header from '../components/Header';
import Information from '../components/Information/Container';
import { userProfileTabs } from 'config/menu';
import './ProfileLayout.scss';

class ProfileLayout extends Component {
  componentWillMount() {
    const {
      profile,
      loadFullProfile,
      fetchActiveBonus,
      fetchIp,
      fetchAccumulatedBalances,
      params,
    } = this.props;

    if (!profile.isLoading) {
      loadFullProfile(params.id)
        .then(() => fetchActiveBonus(params.id))
        .then(() => fetchIp(params.id, { limit: 10 }))
        .then(() => fetchAccumulatedBalances(params.id));
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
      availableStatuses,
      accumulatedBalances,
      updateSubscription,
      changeStatus,
    } = this.props;

    return (
      <div className="player container panel profile-layout">
        <div className="container-fluid">
          <Header
            data={data}
            accumulatedBalances={accumulatedBalances}
            availableStatuses={availableStatuses}
            onStatusChange={changeStatus}
            availableTags={availableTags}
            addTag={addTag.bind(null, params.id)}
            deleteTag={deleteTag.bind(null, params.id)}
          />
          <Information
            data={data}
            ips={ip.entities.content}
            updateSubscription={updateSubscription.bind(null, params.id)}
          />

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
