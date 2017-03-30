import React, { Component } from 'react';
import Personal from './Personal';
import Departments from './Departments';
import IpList from '../../../../../../components/Information/IpList';
import PropTypes from '../../../../../../constants/propTypes';

class Container extends Component {
  static propTypes = {
    data: PropTypes.operatorProfile.isRequired,
    ips: PropTypes.array.isRequired,
  };

  render() {
    const {
      data,
      ips,
    } = this.props;

    return (
      <div
        className="player__account__details row panel-body"
      >
        <Personal data={data} />
        <Departments
          authorities={data.authorities}
        />
        <IpList ips={ips} />
      </div>
    );
  }
}

export default Container;
