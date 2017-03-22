import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Personal from '../../../components/Information/Personal';
import Additional from '../../../components/Information/Additional';
import IpList from '../../../components/Information/IpList';
import Notes from '../../../components/Information/Notes';

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
      <div className="player__account__details row panel-body">
        <Personal data={data} />
        <Additional
          initialValues={{
            marketingMail: data.marketingMail,
            marketingNews: data.marketingNews,
            marketingSMS: data.marketingSMS,
          }}
          updateSubscription={updateSubscription}
        />
        <IpList ips={ips} />

        <Notes
          notes={notes}
          onEditNoteClick={onEditNoteClick}
        />
      </div>
    );
  }
}

export default Information;
