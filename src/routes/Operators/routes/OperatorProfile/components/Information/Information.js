import React, { Component } from 'react';
import Personal from './Personal';
import Departments from './Departments';
import IpList from '../../../../../../components/Information/IpList';
import PropTypes from '../../../../../../constants/propTypes';

class Information extends Component {
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
        className="player__account__details row"
      >
        <div className="col-md-4">
          <Personal data={data} />
        </div>
        <div className="col-md-3">
          <Departments authorities={data.authorities} />
        </div>
        <div className="col-md-2">
          <IpList ips={ips} />
        </div>
      </div>
    );
  }
}

export default Information;
