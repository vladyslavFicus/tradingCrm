import React, { PureComponent } from 'react';
import PermissionContent from 'components/PermissionContent';
import PinnedNotes from 'components/PinnedNotes';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import Personal from './components/Personal';

class Information extends PureComponent {
  static propTypes = {
    profile: PropTypes.profile,
    profileLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    profile: {},
  };

  render() {
    const {
      profile,
      profileLoading,
    } = this.props;

    return (
      <div className="account-details">
        <div className="row">
          {/* ClientPersonalInfo */}
          <div className="col-md-3">
            <Personal profile={profile} profileLoading={profileLoading} />
          </div>
          {/* ClientPinnedNotes */}
          <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
            <div className="col">
              <PinnedNotes targetUUID={profile.uuid} targetType={targetTypes.PLAYER} />
            </div>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default Information;
