import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Profile extends Component {
  render() {
    const { name, isActive, profile } = this.props;

    return <div id={`tab-${name}`} className={classNames('tab-pane fade', { 'in active': isActive })}>
      <dl className="dl-horizontal user-profile-dl">
        <dt>Username</dt>
        <dd>{profile.data.username}</dd>

        <dt>Email</dt>
        <dd>{profile.data.username}</dd>

        <dt>Uuid</dt>
        <dd>{profile.data.uuid}</dd>

        <dt>Balance</dt>
        <dd>10 {profile.data.currency}</dd>
      </dl>
    </div>;
  }
}

export default Profile;
