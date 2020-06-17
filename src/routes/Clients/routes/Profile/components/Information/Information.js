import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import IpList from 'components/Information/IpList';
import PermissionContent from 'components/PermissionContent';
import PinnedNotesList from 'components/PinnedNotesList';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import AcquisitionStatus from './components/AcquisitionStatus';
import Personal from './components/Personal';

class Information extends PureComponent {
  static propTypes = {
    profile: PropTypes.object,
    ips: PropTypes.array.isRequired,
    acquisitionData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    profile: {},
  };

  render() {
    const {
      ips,
      acquisitionData,
      loading,
      profile,
    } = this.props;

    return (
      <div className="account-details">
        <div className="row">
          <div className="col-md-3">
            <Personal profile={profile} loading={loading} />
          </div>
          <div className="col-md-3">
            <AcquisitionStatus
              acquisitionData={acquisitionData}
              profile={profile}
              loading={loading}
            />
          </div>
          <div className="col-md-2">
            <IpList label={I18n.t('PLAYER_PROFILE.IP_LIST.TITLE')} ips={ips} />
          </div>
          <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
            <div className="col">
              <PinnedNotesList targetUUID={profile.uuid} targetType={targetTypes.PLAYER} />
            </div>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default Information;
