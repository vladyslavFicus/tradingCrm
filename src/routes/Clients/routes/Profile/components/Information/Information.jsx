import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import IpList from '../../../../../../components/Information/IpList';
import Personal from './Personal';
import Notes from './Notes';
import PermissionContent from '../../../../../../components/PermissionContent';
import { withServiceCheck } from '../../../../../../components/HighOrder';
import permissions from '../../../../../../config/permissions';
import PendingPayouts from './PendingPayouts';
import AcquisitionStatus from './AcquisitionStatus';
import { services } from '../../../../../../constants/services';

class Information extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    onEditNoteClick: PropTypes.func.isRequired,
    ips: PropTypes.array.isRequired,
    notes: PropTypes.object,
    checkService: PropTypes.func.isRequired,
    acquisitionData: PropTypes.object.isRequired,
  };

  static defaultProps = {
    data: {},
    notes: {},
  };

  render() {
    const {
      data,
      ips,
      notes,
      onEditNoteClick,
      checkService,
      acquisitionData,
    } = this.props;

    return (
      <div className="account-details">
        <div className="row">
          <div className="col-md-3">
            <Personal data={data} />
          </div>
          <div className="col-md-3">
            <AcquisitionStatus
              acquisitionData={acquisitionData}
            />
          </div>
          <div className="col-md-2">
            <IpList label={I18n.t('PLAYER_PROFILE.IP_LIST.TITLE')} ips={ips} />
          </div>
          <If condition={checkService(services.dwh)}>
            <PendingPayouts playerUUID={data.playerUUID} />
          </If>
          <PermissionContent permissions={permissions.NOTES.VIEW_NOTES}>
            <div className="col">
              <Notes
                notes={notes}
                onEditNoteClick={onEditNoteClick}
              />
            </div>
          </PermissionContent>
        </div>
      </div>
    );
  }
}

export default withServiceCheck(Information);
