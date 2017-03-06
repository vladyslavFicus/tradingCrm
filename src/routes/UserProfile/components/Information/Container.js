import React, { Component, PropTypes } from 'react';
import Personal from './Personal';
import Additional from './Additional';
import IpList from './IpList';
import Notes from './Notes';

class Container extends Component {
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
        <Personal data={data}/>
        <Additional
          initialValues={{
            marketingMail: data.marketingMail,
            marketingNews: data.marketingNews,
            marketingSMS: data.marketingSMS,
          }}
          updateSubscription={updateSubscription}
        />
        <IpList ips={ips}/>

        <Notes
          notes={notes}
          onEditNoteClick={onEditNoteClick}
        />
      </div>
    );
  }
}

export default Container;
