import React, { Component } from 'react';
import classNames from 'classnames';

const config = { tabName: 'profile' };

class View extends Component {
  componentWillMount() {
    const { profile, loadProfile, params } = this.props;

    if ((!profile.receivedAt || params.id !== profile.data.uiid) && !profile.isLoading) {
      loadProfile(params.id);
    }
  }

  render() {
    const { profile } = this.props;

    return <div id={`tab-${config.tabName}`} className={classNames('tab-pane fade in active')}>
      <dl className="dl-horizontal user-profile-dl">
        <dt>Username</dt>
        <dd>{profile.data.username}</dd>

        <dt>Email</dt>
        <dd>{profile.data.email}</dd>

        <dt>Uuid</dt>
        <dd>{profile.data.uuid}</dd>

        <dt>Balance</dt>
        <dd>10 {profile.data.currency}</dd>
      </dl>
    </div>;
  }
}

export default View;
