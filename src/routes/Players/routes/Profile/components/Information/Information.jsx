import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import IpList from '../../../../../../components/Information/IpList';
import Personal from './Personal';
import Additional from './Additional';
import Notes from './Notes';
import PermissionContent from '../../../../../../components/PermissionContent';
import permissions from '../../../../../../config/permissions';
import PendingPayouts from './PendingPayouts';
import { services } from '../../../../../../constants/services';
import ServiceContent from '../../../../../../components/ServiceContent';

class Information extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    updateSubscription: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    ips: PropTypes.array.isRequired,
    notes: PropTypes.object,
  };

  static defaultProps = {
    data: {},
    notes: {},
  };

  render() {
    const {
      data,
      ips,
      updateSubscription,
      notes,
      onEditNoteClick,
    } = this.props;

    return (
      <div className="account-details">
        <div className="row">
          <div className="col-md-3">
            <Personal data={data} />
          </div>
          <div className="col-md-2">
            <Additional
              profileStatus={data.profileStatus}
              initialValues={{
                marketingMail: data.marketingMail,
                marketingNews: data.marketingNews,
                marketingSMS: data.marketingSMS,
              }}
              updateSubscription={updateSubscription}
            />
          </div>
          <div className="col-md-2">
            <IpList label={I18n.t('PLAYER_PROFILE.IP_LIST.TITLE')} ips={ips} />
          </div>
          <ServiceContent service={services.dwh}>
            <PendingPayouts playerUUID={data.playerUUID} />
          </ServiceContent>
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

export default Information;
