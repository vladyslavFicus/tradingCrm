import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import IpList from '../../../../components/Information/IpList';
import Personal from './Personal';
import Additional from './Additional';
import Notes from './Notes';

class Information extends Component {
  static propTypes = {
    data: PropTypes.object,
    updateSubscription: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    ips: PropTypes.array.isRequired,
    notes: PropTypes.object.isRequired,
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
          <div className="col-md-4">
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
          <div className="col-md-4">
            <Notes
              notes={notes}
              onEditNoteClick={onEditNoteClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Information;
