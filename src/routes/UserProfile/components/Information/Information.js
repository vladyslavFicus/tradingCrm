import React, { Component, PropTypes } from 'react';
import IpList from '../../../../components/Information/IpList';
import Personal from './Personal';
import Additional from './Additional';
import Notes from './Notes';
import './Information.scss';

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
      <div className="player__account__details row">
        <div className="col-md-3">
          <Personal data={data} />
        </div>
        <div className="col-md-3">
          <Additional
            initialValues={{
              marketingMail: data.marketingMail,
              marketingNews: data.marketingNews,
              marketingSMS: data.marketingSMS,
            }}
            updateSubscription={updateSubscription}
          />
        </div>
        <div className="col-md-2">
          <IpList ips={ips} />
        </div>
        <div className="col-md-4">
          <Notes
            notes={notes}
            onEditNoteClick={onEditNoteClick}
          />
        </div>
      </div>
    );
  }
}

export default Information;
