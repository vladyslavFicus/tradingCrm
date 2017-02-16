import React, { Component, PropTypes } from 'react';

import Personal from './Personal';
import Additional from './Additional';
import IpList from './IpList';
import Notes from './Notes';

class Container extends Component {
  render() {
    const { data, ips } = this.props;

    return (
      <div className="player__account__details row panel-body">
        <Personal data={data}/>
        <Additional/>
        <IpList ips={ips}/>
        <Notes/>
      </div>
    );
  }
}

Container.propTypes = {};
Container.defaultProps = {};

export default Container;
