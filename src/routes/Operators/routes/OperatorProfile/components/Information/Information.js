import React from 'react';
import Personal from './Personal';
import Departments from './Departments';
import IpList from '../../../../../../components/Information/IpList';
import PropTypes from '../../../../../../constants/propTypes';

const Information = ({ data, ips }) => (
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

Information.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
  ips: PropTypes.array.isRequired,
};

export default Information;
