import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Personal from '../../../components/Information/Personal';
import Additional from '../../../components/Information/Additional';
import IpList from '../../../components/Information/IpList';
import Notes from '../../../components/Information/Notes';
import '../../../components/Information/Information.scss';

class Information extends Component {
  static propTypes = {
    data: PropTypes.object,
    showNotes: PropTypes.bool,
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
      showNotes,
    } = this.props;

    return (
      <div
        className={classNames('player__account__details row panel-body profile-information', {
          'hide-notes': !showNotes,
        })}
      >
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

        {showNotes && <Notes
          notes={notes}
          onEditNoteClick={onEditNoteClick}
        />}
      </div>
    );
  }
}

export default Information;
