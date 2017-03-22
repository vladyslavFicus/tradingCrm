import React, { Component, PropTypes } from 'react';
import Personal from '../../../../../components/Information/Personal';
import Departments from '../../../../../components/Information/Departments';
import IpList from '../../../../../components/Information/IpList';

class Information extends Component {
  static propTypes = {
    data: PropTypes.object,
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

export default Information;
