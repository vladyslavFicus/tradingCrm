import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import IpList from 'components/Information/IpList';
import PermissionContent from 'components/PermissionContent';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import AcquisitionStatus from './AcquisitionStatus';
import Personal from './Personal';
import Notes from './Notes';

class Information extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    onEditNoteClick: PropTypes.func.isRequired,
    ips: PropTypes.array.isRequired,
    pinnedNotes: PropTypes.object,
    acquisitionData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    data: {},
    pinnedNotes: {},
  };

  render() {
    const {
      data,
      ips,
      pinnedNotes,
      onEditNoteClick,
      acquisitionData,
      loading,
      locale,
    } = this.props;

    return (
      <div className="account-details">
        <div className="row">
          <div className="col-md-3">
            <Personal data={data} loading={loading} locale={locale} />
          </div>
          <div className="col-md-3">
            <AcquisitionStatus
              acquisitionData={acquisitionData}
              loading={loading}
            />
          </div>
          <div className="col-md-2">
            <IpList label={I18n.t('PLAYER_PROFILE.IP_LIST.TITLE')} ips={ips} />
          </div>
          <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
            <div className="col">
              <Notes
                notes={pinnedNotes}
                onEditNoteClick={onEditNoteClick}
                locale={locale}
              />
            </div>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default Information;
