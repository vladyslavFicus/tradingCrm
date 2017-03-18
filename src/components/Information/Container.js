import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Personal from './Personal';
import Additional from './Additional';
import IpList from './IpList';
import Notes from './Notes';

import './Information.scss';

class Container extends Component {
  static propTypes = {
    data: PropTypes.object,
    showNotes: PropTypes.bool,
    updateSubscription: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
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

export default Container;
